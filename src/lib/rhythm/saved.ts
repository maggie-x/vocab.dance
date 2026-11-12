import { emptyNudges, emptyRows, hitsFrom, INSTS, Nudges, Offsets, PatternConfig, RES, Res, Rows, stepsPerBar, ZERO_OFFSETS } from './patterns';

/**
 * A rhythm kept in `src/data/rhythms.json`. Hits are beat strings like "1,2&,3e" (bar 2 of a two-bar pattern is
 * written with beats 5 to 8). `source` is the song it was taken from.
 */
export interface SavedRhythm {
  name: string;
  source: string;
  sourceUrl?: string;
  bpm: number;
  res?: Res;
  bars?: number;
  kick?: string;
  snare?: string;
  hat?: string;
  ghost?: string;
  swing?: number;
  offsets?: Partial<Offsets>;
  /** Per-hit timing in ms beyond swing and the instrument offset, keyed by count, e.g. { "kick": { "3e": -40 } }. */
  nudges?: Partial<Record<Inst, Record<string, number>>>;
  notes?: string;
}

type Inst = keyof Rows;

const SUBS: Record<Res, string[]> = { '16': ['', 'e', '&', 'a'], '8': ['', '&'], '12': ['', 't', 'l'] };

/** Step index to a count like "2&", "6a" (beats past 4 are the second bar). */
export function stepName(i: number, res: Res): string {
  const per = RES[res].steps;
  return `${Math.floor(i / per) + 1}${SUBS[res][i % per]}`;
}

export function rowsToStrings(rows: Rows, res: Res): Record<'kick' | 'snare' | 'hat' | 'ghost', string> {
  const out = { kick: '', snare: '', hat: '', ghost: '' };
  for (const inst of INSTS) {
    out[inst] = rows[inst].map((on, i) => (on ? stepName(i, res) : null)).filter(Boolean).join(',');
  }
  return out;
}

export function savedToConfig(r: SavedRhythm): PatternConfig & { bpm: number } {
  const res: Res = r.res ?? '16', bars = r.bars ?? 1;
  const total = stepsPerBar(res) * bars;
  const rows = emptyRows(total);
  const strings = { kick: r.kick, snare: r.snare, hat: r.hat, ghost: r.ghost };
  for (const inst of INSTS) hitsFrom(strings[inst], res).forEach((i) => { if (i >= 0 && i < total) rows[inst][i] = true; });
  const offsets: Offsets = { ...ZERO_OFFSETS, ...(r.offsets || {}) };
  if (r.offsets && r.offsets.ghost === undefined) offsets.ghost = offsets.snare;
  const nudges = emptyNudges(total);
  for (const inst of INSTS) {
    const byName = r.nudges?.[inst];
    if (!byName) continue;
    for (const [name, ms] of Object.entries(byName)) {
      const [step] = hitsFrom(name, res);
      if (step !== undefined && step >= 0 && step < total) nudges[inst][step] = ms;
    }
  }
  return {
    name: r.name,
    purpose: [`From ${r.source}.`, r.notes].filter(Boolean).join(' '),
    res,
    bars,
    rows,
    swing: r.swing ?? 50,
    offsets,
    nudges,
    bpm: r.bpm,
  };
}

export interface CurrentPattern {
  name: string;
  res: Res;
  bars: number;
  rows: Rows;
  swing: number;
  offsets: Offsets;
  nudges?: Nudges;
  bpm: number;
}

/** The current grid as a JSON entry, with `source` left for the author to fill in. */
export function configToSaved(p: CurrentPattern, source = ''): SavedRhythm {
  const s = rowsToStrings(p.rows, p.res);
  const entry: SavedRhythm = { name: p.name.replace(/ \(edited\)$/, ''), source, bpm: p.bpm, res: p.res, bars: p.bars, kick: s.kick, snare: s.snare, hat: s.hat };
  if (s.ghost) entry.ghost = s.ghost;
  if (p.swing !== 50) entry.swing = p.swing;
  const offsets: Partial<Offsets> = {};
  for (const inst of ['kick', 'snare', 'hat'] as const) if (p.offsets[inst]) offsets[inst] = p.offsets[inst];
  if (Object.keys(offsets).length) entry.offsets = offsets;
  if (p.nudges) {
    const nudges: NonNullable<SavedRhythm['nudges']> = {};
    for (const inst of INSTS) {
      const byName: Record<string, number> = {};
      p.nudges[inst].forEach((ms, i) => { if (ms && p.rows[inst][i]) byName[stepName(i, p.res)] = ms; });
      if (Object.keys(byName).length) nudges[inst] = byName;
    }
    if (Object.keys(nudges).length) entry.nudges = nudges;
  }
  return entry;
}

export const savedToJson = (entry: SavedRhythm): string => JSON.stringify(entry, null, 2);
