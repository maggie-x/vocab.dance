export type Res = '8' | '16' | '12';
export type Inst = 'kick' | 'snare' | 'hat' | 'ghost';
export type Rows = Record<Inst, boolean[]>;
export type Offsets = Record<Inst, number>;
/** Per-cell timing in milliseconds on top of swing and the instrument offset. Detection fills these in. */
export type Nudges = Record<Inst, number[]>;

export const RES: Record<Res, { steps: number; labels: string[] }> = {
  '8': { steps: 2, labels: ['1', '&'] },
  '16': { steps: 4, labels: ['1', 'e', '&', 'a'] },
  '12': { steps: 3, labels: ['1', 'trip', 'let'] },
};
export const INSTS: Inst[] = ['kick', 'snare', 'hat', 'ghost'];
export const INST_NAME: Record<Inst, string> = { kick: 'Kick', snare: 'Snare', hat: 'Hi-hat', ghost: 'Ghost' };
export const HAT8 = '1,1&,2,2&,3,3&,4,4&';
export const HAT16 = '1,1e,1&,1a,2,2e,2&,2a,3,3e,3&,3a,4,4e,4&,4a';

export const ZERO_OFFSETS: Offsets = { kick: 0, snare: 0, hat: 0, ghost: 0 };

export interface Preset {
  id: string;
  name: string;
  kick: string;
  snare: string;
  ghost?: string;
  hat?: string;
  swing?: number;
  offsets?: Partial<Offsets>;
  purpose: string;
}

export interface Variant {
  base: string;
  name?: string;
  kick?: string;
  snare?: string;
  ghost?: string;
  hat?: string;
  swing?: number;
  offsets?: Partial<Offsets>;
  purpose?: string;
}

export type PatternRef = string | Variant;

export interface PatternConfig {
  name: string;
  purpose: string;
  res: Res;
  bars: number;
  rows: Rows;
  swing: number;
  offsets: Offsets;
  nudges?: Nudges;
}

export const PRESETS: Preset[] = [
  { id: 'boom', name: 'Straight boom bap', kick: '1,3', snare: '2,4', purpose: 'The basic backbeat. Kick on 1 and 3, snare on 2 and 4.' },
  { id: 'offbeat', name: 'Offbeat kick', kick: '1,2&,3', snare: '2,4', purpose: 'One kick moves to the "&" after 2. First taste of syncopation.' },
  { id: 'broken', name: 'Broken kick', kick: '1,2&,3&,4&', snare: '2,4', purpose: 'Irregular kick movement. Only the first kick is on a beat.' },
  { id: 'double', name: 'Double kick', kick: '1,1&,3,3&', snare: '2,4', purpose: 'Repeated kick accents. Two quick hits before each snare.' },
  { id: 'displaced', name: 'Displaced snare', kick: '1,3', snare: '2,4', offsets: { snare: -25 }, purpose: 'Same placement as boom bap, but the snare lands about 25 ms before 2 and 4. Placement unchanged, timing changed.' },
  { id: 'ghost', name: 'Ghost snare', kick: '1,3', snare: '2,4', ghost: '2&', purpose: 'A quiet snare on the "&" after 2. Hear the contrast between the accent and the ghost.' },
];

export const VARIANTS: Variant[] = [
  { base: 'boom', name: 'Boom bap, 16th hats', hat: HAT16, purpose: 'Same backbeat with hats on every 16th. The straight version to compare swing against.' },
  { base: 'boom', name: 'Boom bap, 16th hats swung', hat: HAT16, swing: 66, purpose: 'The "e" and "a" hats land late. Nothing changes cell, only the spacing.' },
  { base: 'boom', name: 'Boom bap, kick laid back', offsets: { kick: 22 }, purpose: 'Every kick sounds about 22 ms after the grid. Relaxed, heavy feel.' },
  { base: 'offbeat', name: 'Kick late, snare early', offsets: { kick: 18, snare: -18 }, purpose: 'The two drums lean in opposite directions. Kick and snare do not have to share a timing.' },
  { base: 'ghost', name: 'Ghost snare, snare early', offsets: { snare: -20 }, purpose: 'The ghost note stays put while the main snare is pushed early, so the gap between them shrinks.' },
  { base: 'ghost', name: 'Extra ghost notes', ghost: '2&,3a', purpose: 'Two quiet snares between the backbeats for texture.' },
  { base: 'boom', name: 'Snare displaced to 3a', snare: '2,3a', purpose: 'The second snare moves to the "a" before 4. A new cell, not just early timing.' },
  { base: 'offbeat', name: 'Dilla feel demo', swing: 58, offsets: { kick: 20, snare: -15 }, purpose: 'Offbeat kick placement, a little swing, kick late and snare early. Illustrative, not a transcription.' },
];

export interface Concept {
  title: string;
  body: string;
  demo: Variant;
  label: string;
}

export const CONCEPTS: Concept[] = [
  { title: 'Syncopation', body: 'An accent where you do not expect one. In 4/4 the expected places are the beats. A kick on the "&" after 2 is syncopated because it lands between beats. This is about placement on the grid.', demo: { base: 'offbeat' }, label: 'Hear the offbeat kick' },
  { title: 'Swing', body: 'Unequal spacing between subdivisions. The "e" and "a" steps are pushed late so each pair of 16ths becomes long-short. The cell does not change, the spacing does. Hats on straight 8ths are not affected by 16th swing.', demo: { base: 'boom', name: 'Boom bap, 16th hats swung', hat: HAT16, swing: 68 }, label: 'Hear swung hats' },
  { title: 'Microtiming', body: 'A hit that sounds a few milliseconds before or after its grid position. Too small to be a different step, big enough to change the feel. Early feels urgent. Late feels relaxed.', demo: { base: 'boom', name: 'Boom bap, kick laid back', offsets: { kick: 22 } }, label: 'Hear a late kick' },
  { title: 'Kick and snare independence', body: 'Kick and snare do not have to share a timing. Much of the Dilla-associated feel comes from one drum leaning one way while another leans the other. Not everything is simply late or swung.', demo: { base: 'offbeat', name: 'Kick late, snare early', offsets: { kick: 18, snare: -18 } }, label: 'Hear them pull apart' },
  { title: 'Ghost notes', body: 'Quiet snare hits between the main ones. They add texture and movement without competing with the backbeat. Listen for them under the hats.', demo: { base: 'ghost', ghost: '2&,3a' }, label: 'Hear ghost notes' },
  { title: 'Rhythmic displacement', body: 'Moving a hit to a position you did not expect. Here the snare on 4 moves to the "a" just before it. Compare with the snare that is merely early in timing but still on 4.', demo: { base: 'boom', name: 'Snare displaced to 3a', snare: '2,3a' }, label: 'Hear the moved snare' },
];

export type HearMode = 'all' | 'kick' | 'snare' | 'ks' | 'none';

export interface Exercise {
  key: string;
  title: string;
  body: string;
  hear: HearMode;
  pattern: PatternRef;
  bpm?: number;
}

export const EXERCISES: Exercise[] = [
  { key: 'A', title: 'Follow the kick', body: 'Hear only the kick and the hats. Let your weight drop on every kick. Keep the rest of the body bouncing lightly on the pulse.', hear: 'kick', pattern: 'broken' },
  { key: 'B', title: 'Follow the snare', body: 'Hear only the snare and the hats. Mark each snare with one body part, an isolation or a change in quality. Nothing else reacts.', hear: 'snare', pattern: 'boom' },
  { key: 'C', title: 'Kick versus snare', body: 'Hear both. Give the kick to your lower body and the snare to your upper body, or the kick to weight and the snare to texture. Keep them independent.', hear: 'ks', pattern: 'offbeat' },
  { key: 'D', title: 'Fill the gaps', body: 'Hear everything. Move only in the empty cells between hits. Freeze or soften on each hit. The rests are where your material lives.', hear: 'all', pattern: 'boom', bpm: 80 },
  { key: 'E', title: 'Maintain groove', body: 'Keep a continuous bounce for the whole loop. Add accents on the kicks and snares without ever losing the bounce. If the bounce stops, start again.', hear: 'all', pattern: 'double', bpm: 92 },
  { key: 'F', title: 'Dilla feel', body: 'Same placements as the straight pattern, but the kick sits late and the snare early with a little swing. Dance to it, then switch back to straight. Notice what your body does differently.', hear: 'all', pattern: { base: 'offbeat', name: 'Dilla feel demo', swing: 58, offsets: { kick: 20, snare: -15 } }, bpm: 88 },
];

export const HEAR_SETS: Record<HearMode, Record<Inst, boolean>> = {
  all: { kick: false, snare: false, hat: false, ghost: false },
  kick: { kick: false, snare: true, hat: false, ghost: true },
  snare: { kick: true, snare: false, hat: false, ghost: false },
  ks: { kick: false, snare: false, hat: true, ghost: false },
  none: { kick: true, snare: true, hat: true, ghost: true },
};

export const stepsPerBar = (res: Res): number => RES[res].steps * 4;

/** Parses "1, 2&, 3e" style beat lists into step indices for the given resolution. */
export function hitsFrom(str: string | undefined, res: Res): number[] {
  const per = RES[res].steps;
  const subs: Record<string, number> =
    res === '16' ? { '': 0, e: 1, '&': 2, a: 3 } : res === '8' ? { '': 0, '&': 1 } : { '': 0, t: 1, l: 2 };
  return (str || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((t) => {
      const beat = parseInt(t[0], 10);
      const sub = subs[t.slice(1)] ?? 0;
      return (beat - 1) * per + sub;
    });
}

export function emptyRows(total: number): Rows {
  return { kick: new Array(total).fill(false), snare: new Array(total).fill(false), hat: new Array(total).fill(false), ghost: new Array(total).fill(false) };
}

export function cloneRows(rows: Rows): Rows {
  return { kick: [...rows.kick], snare: [...rows.snare], hat: [...rows.hat], ghost: [...rows.ghost] };
}

export function emptyNudges(total: number): Nudges {
  return { kick: new Array(total).fill(0), snare: new Array(total).fill(0), hat: new Array(total).fill(0), ghost: new Array(total).fill(0) };
}

export function cloneNudges(n: Nudges): Nudges {
  return { kick: [...n.kick], snare: [...n.snare], hat: [...n.hat], ghost: [...n.ghost] };
}

/** Pads or trims per-cell values to the grid length, repeating the first bar when growing. */
export function resizeNudges(n: Nudges, res: Res, bars: number): Nudges {
  const spb = stepsPerBar(res), out = emptyNudges(spb * bars);
  for (const inst of INSTS) for (let i = 0; i < spb * bars; i++) out[inst][i] = n[inst][i] ?? n[inst][i % spb] ?? 0;
  return out;
}

export function configFrom(ref: PatternRef): PatternConfig {
  const baseId = typeof ref === 'string' ? ref : ref.base;
  const base = PRESETS.find((p) => p.id === baseId);
  if (!base) throw new Error(`Unknown preset ${baseId}`);
  const over: Variant = typeof ref === 'string' ? { base: baseId } : ref;
  const strings = {
    kick: over.kick ?? base.kick,
    snare: over.snare ?? base.snare,
    hat: over.hat ?? base.hat ?? HAT8,
    ghost: over.ghost ?? base.ghost ?? '',
  };
  const rows = emptyRows(16);
  for (const inst of INSTS) hitsFrom(strings[inst], '16').forEach((i) => { if (i < 16) rows[inst][i] = true; });
  return {
    name: over.name || base.name,
    purpose: over.purpose ?? base.purpose,
    res: '16',
    bars: 1,
    rows,
    swing: over.swing ?? base.swing ?? 50,
    offsets: { ...ZERO_OFFSETS, ...(base.offsets || {}), ...(over.offsets || {}) },
  };
}

/** Moves hits to the nearest step of a new resolution, beat by beat. */
export function remapRows(rows: Rows, fromRes: Res, toRes: Res, bars: number): Rows {
  const fp = RES[fromRes].steps, tp = RES[toRes].steps;
  const out = emptyRows(tp * 4 * bars);
  for (const inst of INSTS) {
    rows[inst].forEach((on, i) => {
      if (!on) return;
      const beat = Math.floor(i / fp), frac = (i % fp) / fp;
      out[inst][beat * tp + Math.min(tp - 1, Math.round(frac * tp))] = true;
    });
  }
  return out;
}

export function resizeBars(rows: Rows, res: Res, bars: number): Rows {
  const spb = stepsPerBar(res);
  const out = emptyRows(spb * bars);
  for (const inst of INSTS) {
    for (let i = 0; i < spb * bars; i++) out[inst][i] = rows[inst][i % spb] ?? false;
  }
  return out;
}

export const stepLabel = (i: number): string => `${Math.floor(i / 4) + 1}${['', 'e', '&', 'a'][i % 4]}`;

export function fmtOff(ms: number): string {
  if (ms === 0) return 'on the grid';
  return `${Math.abs(ms)} ms ${ms < 0 ? 'early' : 'late'}`;
}

/** Short description of a 16-step config's placements and timing, for the grooves list. */
export function describeConfig(cfg: PatternConfig): string[] {
  const list = (inst: Inst) => cfg.rows[inst].map((on, i) => (on ? stepLabel(i) : null)).filter(Boolean).join(',');
  const parts = [`K ${list('kick')}`, `S ${list('snare')}`];
  if (cfg.rows.ghost.some(Boolean)) parts.push(`G ${list('ghost')}`);
  if (cfg.rows.hat.filter(Boolean).length === 16) parts.push('16th hats');
  if (cfg.swing !== 50) parts.push(`swing ${cfg.swing}%`);
  for (const inst of ['kick', 'snare'] as Inst[]) if (cfg.offsets[inst]) parts.push(`${INST_NAME[inst].toLowerCase()} ${fmtOff(cfg.offsets[inst])}`);
  return parts;
}
