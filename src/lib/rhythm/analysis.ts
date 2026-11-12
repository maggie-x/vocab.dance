import { BandFeatures, FFT_N, HOP } from './dsp';
import { emptyRows, Inst, Offsets, Rows, ZERO_OFFSETS } from './patterns';

export interface Onset {
  i: number;
  t: number;
  s: number;
  sus: number;
}

export interface DrumEvent {
  i: number;
  low?: Onset;
  mid?: Onset;
  hat?: Onset;
  r: number[];
  n: number[];
  cs: number;
  snareLike: boolean;
}

export interface Hit {
  i: number;
  t: number;
  s: number;
}

export type DrumOnsets = Record<'kick' | 'snare' | 'ghost' | 'hat', Hit[]>;

export interface Bar {
  start: number;
  end: number;
}

export interface TrackAnalysis {
  bpm: number;
  beatLen: number;
  phase: number;
  bars: Bar[];
  onsets: DrumOnsets;
  duration: number;
}

export interface BarHit {
  step: number;
  dev: number;
  rel: number;
}

export interface BarDetection {
  rows: Rows;
  swing: number;
  offsets: Offsets;
  hits: Record<Inst, BarHit[]>;
}

interface PeakOptions {
  preMax?: number;
  avg?: number;
  delta?: number;
  wait?: number;
}

/**
 * Peak picking after librosa: a local maximum over ±preMax seconds, above the ±avg local mean by delta, at least
 * `wait` apart (the first of a cluster is kept). Strength is how much the band amplitude rises at the onset, so a
 * sustained bass or pad does not count. Sustain is how much of that rise remains 150 ms later.
 */
export function pickPeaks(odf: Float32Array, amp: Float32Array, sr: number, opts: PeakOptions = {}): Onset[] {
  const { preMax = 0.03, avg = 0.1, delta = 0.12, wait = 0.03 } = opts;
  const fr = sr / HOP, n = odf.length;
  const sorted = Float32Array.from(odf).sort();
  const norm = sorted[Math.floor(n * 0.99)] || 1;
  const pm = Math.max(1, Math.round(preMax * fr)), av = Math.max(1, Math.round(avg * fr)), wt = Math.round(wait * fr);
  const pre = new Float64Array(n + 1);
  for (let i = 0; i < n; i++) pre[i + 1] = pre[i] + odf[i];
  const later = Math.round(0.15 * fr);
  const cands: Onset[] = [];
  let lastI = -Infinity;
  for (let i = 3; i < n - 3; i++) {
    if (i - lastI < wt) continue;
    const v = odf[i] / norm;
    if (v < delta) continue;
    let isMax = true;
    for (let j = Math.max(0, i - pm); j <= Math.min(n - 1, i + pm); j++) if (odf[j] > odf[i]) { isMax = false; break; }
    if (!isMax) continue;
    const a0 = Math.max(0, i - av), a1 = Math.min(n, i + av + 1);
    if (v - (pre[a1] - pre[a0]) / (a1 - a0) / norm < delta) continue;
    const before = Math.min(amp[i - 3], amp[i - 2], amp[i - 1]);
    let peak = 0;
    for (let j = i; j <= Math.min(n - 1, i + Math.max(3, wt)); j++) if (amp[j] > peak) peak = amp[j];
    const s = Math.max(0, peak - before);
    if (s <= 0) continue;
    const sus = Math.max(0, Math.min(1, (amp[Math.min(n - 1, i + later)] - before) / s));
    const y0 = odf[i - 1], y1 = odf[i], y2 = odf[i + 1], den = y0 - 2 * y1 + y2;
    const frac = den ? Math.max(-0.5, Math.min(0.5, (0.5 * (y0 - y2)) / den)) : 0;
    const t = ((i + frac) * HOP + FFT_N - HOP) / sr;
    cands.push({ i, t, s, sus });
    lastI = i;
  }
  let maxS = 0;
  for (const c of cands) if (c.s > maxS) maxS = c.s;
  return cands.filter((c) => c.s >= maxS * 0.03);
}

function riseAt(ampArr: Float32Array, i: number, span: number): number {
  const n = ampArr.length;
  const before = Math.min(ampArr[Math.max(0, i - 3)], ampArr[Math.max(0, i - 2)], ampArr[Math.max(0, i - 1)]);
  let peak = 0;
  for (let j = i; j <= Math.min(n - 1, i + span); j++) if (ampArr[j] > peak) peak = ampArr[j];
  return Math.max(0, peak - before);
}

const pct95 = (vals: number[]): number => {
  const v = vals.filter((x) => x > 0).sort((x, y) => x - y);
  return v.length ? v[Math.floor(v.length * 0.95)] : 1;
};

/**
 * Onsets from the three detectors within 25 ms of each other are one event. An event keeps each band's own onset
 * time and how much every band rose, normalised to the loudest rises in that band, so a hit is judged by shape.
 */
export function buildEvents(features: BandFeatures, sr: number): DrumEvent[] {
  const { odf, amp } = features;
  const fr = sr / HOP;
  const snareOdf = odf[1].map((v, i) => v + 0.5 * odf[2][i]);
  type Tagged = Onset & { band: 'low' | 'mid' | 'hat' };
  const tag = (list: Onset[], band: Tagged['band']): Tagged[] => list.map((o) => ({ ...o, band }));
  const all: Tagged[] = [
    ...tag(pickPeaks(odf[0], amp[0], sr, { wait: 0.1, delta: 0.2 }), 'low'),
    ...tag(pickPeaks(snareOdf, amp[1], sr, { wait: 0.06 }), 'mid'),
    ...tag(pickPeaks(odf[3], amp[3], sr, { wait: 0.03, delta: 0.1 }), 'hat'),
  ].sort((a, b) => a.i - b.i);
  const win = Math.round(0.025 * fr), span = Math.round(0.035 * fr), later = Math.round(0.04 * fr);
  const events: DrumEvent[] = [];
  for (const o of all) {
    const ev = events[events.length - 1];
    if (ev && o.i - ev.i <= win) {
      if (!ev[o.band] || o.s > (ev[o.band] as Onset).s) ev[o.band] = o;
      continue;
    }
    events.push({ i: o.i, [o.band]: o, r: [], n: [], cs: 0, snareLike: false });
  }
  for (const ev of events) {
    ev.r = amp.map((a) => riseAt(a, ev.i, span));
    const c = amp[2];
    const before = Math.min(c[Math.max(0, ev.i - 3)], c[Math.max(0, ev.i - 2)], c[Math.max(0, ev.i - 1)]);
    ev.cs = ev.r[2] > 0 ? Math.max(0, Math.min(1, (c[Math.min(c.length - 1, ev.i + later)] - before) / ev.r[2])) : 0;
  }
  const norms = amp.map((_, b) => pct95(events.map((e) => e.r[b])));
  for (const ev of events) ev.n = ev.r.map((r, b) => r / norms[b]);
  const snareLike = (ev: DrumEvent): boolean =>
    !!ev.mid && ev.n[2] >= 0.12 && ev.cs >= 0.25 && ev.n[1] / Math.max(ev.n[2], 1e-6) >= 0.2 && ev.n[0] / Math.max(ev.n[2], 1e-6) < 1.5;
  const hatNorm = pct95(events.filter((e) => !snareLike(e)).map((e) => e.r[3]));
  for (const ev of events) {
    ev.n[3] = ev.r[3] / hatNorm;
    ev.snareLike = snareLike(ev);
  }
  return events;
}

/**
 * Kick: a clear low-band rise that does not hold like a bass note, with some attack above 150 Hz. Snare: crack that
 * lasts, body under it and the low band not dominant; the quieter ones are ghosts. Hat: a clear rise in the top band.
 */
export function classifyEvents(events: DrumEvent[]): DrumOnsets {
  const out: DrumOnsets = { kick: [], snare: [], ghost: [], hat: [] };
  for (const ev of events) {
    const [low, body, crack, hat] = ev.n;
    const hasAttack = body >= 0.08 || crack >= 0.08;
    if (ev.low && low >= 0.3 && ev.low.sus < 0.85 && hasAttack) out.kick.push({ i: ev.i, t: ev.low.t, s: low });
    if (ev.snareLike && ev.mid) (crack >= 0.4 ? out.snare : out.ghost).push({ i: ev.i, t: ev.mid.t, s: crack });
    if (ev.hat && hat >= 0.25) out.hat.push({ i: ev.i, t: ev.hat.t, s: Math.min(1, hat) });
  }
  return out;
}

export function impulseTrain(onsets: Hit[], n: number): Float32Array {
  const raw = new Float32Array(n), out = new Float32Array(n);
  for (const o of onsets) if (o.i < n) raw[o.i] += o.s;
  const k = [1, 2, 3, 2, 1];
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let j = -2; j <= 2; j++) s += (raw[i + j] || 0) * k[j + 2];
    out[i] = s / 9;
  }
  return out;
}

const foldTempo = (bpm: number): number => {
  let b = bpm;
  while (b > 135) b /= 2;
  while (b < 62) b *= 2;
  return b;
};

/**
 * Coarse tempo after Ellis: autocorrelation of the onset train weighted by a log-Gaussian prior centred on 90 BPM,
 * with the half-period lag reinforcing each candidate, folded into 62–135 BPM.
 */
export function coarseTempo(train: Float32Array, fr: number): number {
  const n = Math.min(train.length, Math.round(fr * 120));
  const minL = Math.floor((60 / 180) * fr), maxL = Math.ceil((60 / 40) * fr);
  const r = new Float32Array(2 * maxL + 2);
  for (let L = minL; L <= 2 * maxL + 1 && L < n; L++) {
    let s = 0;
    for (let i = 0; i + L < n; i++) s += train[i] * train[i + L];
    r[L] = s / (n - L);
  }
  let best = -1, bestL = minL;
  for (let L = minL; L <= maxL; L++) {
    const prior = Math.exp(-0.5 * (Math.log2(foldTempo((60 * fr) / L) / 90) / 0.45) ** 2);
    const sc = (r[L] + 0.5 * (r[2 * L] || 0)) * prior;
    if (sc > best) { best = sc; bestL = L; }
  }
  return foldTempo((60 * fr) / bestL);
}

export interface GridFit {
  bpm: number;
  step: number;
  phaseStep: number;
}

/**
 * Fine tempo and grid phase. The 16th-note grid at a candidate tempo is a phase wheel; every onset is a vector on it
 * weighted by strength. The tempo where they add up most coherently wins and their mean angle is the grid phase.
 */
export function fitGrid(onsets: Hit[], bpm0: number, span: number): GridFit {
  const score = (bpm: number) => {
    const step = 15 / bpm;
    let re = 0, im = 0;
    for (const o of onsets) { const a = (2 * Math.PI * o.t) / step; re += o.s * Math.cos(a); im += o.s * Math.sin(a); }
    return { mag: Math.hypot(re, im), ang: Math.atan2(im, re), step };
  };
  let best: ReturnType<typeof score> | null = null, bestBpm = bpm0;
  const search = (lo: number, hi: number, inc: number) => {
    for (let b = lo; b <= hi + 1e-9; b += inc) {
      const r = score(b);
      if (!best || r.mag > best.mag) { best = r; bestBpm = b; }
    }
  };
  const w = bpm0 * span;
  search(bpm0 - w, bpm0 + w, w / 60);
  const c = bestBpm;
  best = null;
  search(c - w / 60, c + w / 60, w / 3000);
  const b = best as unknown as ReturnType<typeof score>;
  const phaseStep = ((((b.ang / (2 * Math.PI)) * b.step) % b.step) + b.step) % b.step;
  return { bpm: bestBpm, step: b.step, phaseStep };
}

/** Which 16th is beat 1: kicks favour 1 and 3, snares favour 2 and 4, and the kick on 1 tends to be the strongest. */
export function chooseBarStart(onsets: DrumOnsets, step: number, phaseStep: number): number {
  const K = new Float64Array(16), S = new Float64Array(16);
  const acc = (arr: Float64Array, list: Hit[]) => {
    for (const o of list) arr[((Math.round((o.t - phaseStep) / step) % 16) + 16) % 16] += o.s;
  };
  acc(K, onsets.kick); acc(S, onsets.snare);
  let best = -Infinity, bj = 0;
  for (let j = 0; j < 16; j++) {
    const at = (a: Float64Array, q: number) => a[(j + q) % 16];
    const sc = at(K, 0) + at(K, 8) + at(S, 4) + at(S, 12)
      - 0.5 * (at(S, 0) + at(S, 8) + at(K, 4) + at(K, 12))
      + 0.25 * (at(K, 0) - at(K, 8));
    if (best === -Infinity || sc > best + 0.01 * Math.abs(best)) { best = sc; bj = j; }
  }
  let start = phaseStep + bj * step;
  const barLen = 16 * step;
  while (start - barLen >= 0) start -= barLen;
  return start;
}

export function buildBars(phase: number, beatLen: number, duration: number): Bar[] {
  const barLen = beatLen * 4, bars: Bar[] = [];
  for (let s = phase; s + barLen <= duration + 0.01; s += barLen) bars.push({ start: s, end: s + barLen });
  if (!bars.length) bars.push({ start: 0, end: Math.min(duration, barLen) });
  return bars;
}

export function barStrength(onsets: DrumOnsets, bar: Bar): number {
  const inRange = (o: Hit) => o.t >= bar.start && o.t < bar.end;
  return onsets.kick.filter(inRange).reduce((a, o) => a + o.s, 0) + onsets.snare.filter(inRange).reduce((a, o) => a + o.s, 0);
}

export function busiestBar(a: TrackAnalysis): number {
  let best = -1, idx = 0;
  a.bars.forEach((b, i) => { const s = barStrength(a.onsets, b); if (s > best) { best = s; idx = i; } });
  return idx;
}

/** Fits the grid at a tempo near `bpm` (within ±span) and rebuilds bars from the chosen downbeat. */
export function fitTempo(a: TrackAnalysis, bpm: number, span: number): TrackAnalysis {
  const all = [...a.onsets.kick, ...a.onsets.snare, ...a.onsets.hat];
  const g = fitGrid(all, bpm, span);
  const fitted = Math.round(g.bpm * 100) / 100, beatLen = 60 / fitted;
  const phase = chooseBarStart(a.onsets, g.step, g.phaseStep);
  return { ...a, bpm: fitted, beatLen, phase, bars: buildBars(phase, beatLen, a.duration) };
}

export function shiftPhase(a: TrackAnalysis, beats: number): TrackAnalysis {
  const barLen = a.beatLen * 4;
  const phase = (((a.phase + beats * a.beatLen) % barLen) + barLen) % barLen;
  return { ...a, phase, bars: buildBars(phase, a.beatLen, a.duration) };
}

export type FeatureRunner = (mono: Float32Array, sr: number, onProgress: (f: number) => void) => Promise<BandFeatures>;

export async function analyseAudio(
  mono: Float32Array,
  sr: number,
  duration: number,
  run: FeatureRunner,
  onProgress: (f: number) => void = () => {}
): Promise<TrackAnalysis> {
  const features = await run(mono, sr, onProgress);
  const onsets = classifyEvents(buildEvents(features, sr));
  const n = features.frames;
  const comb = impulseTrain(onsets.kick, n).map((v, i) => v + impulseTrain(onsets.snare, n)[i]);
  const coarse = coarseTempo(comb, sr / HOP);
  const base: TrackAnalysis = { bpm: coarse, beatLen: 60 / coarse, phase: 0, bars: [], onsets, duration };
  return fitTempo(base, coarse, 0.04);
}

/** Snaps the detected hits of one bar onto a 16-step grid with the average timing per instrument. */
export function detectBar(a: TrackAnalysis, barIndex: number): BarDetection {
  const bar = a.bars[barIndex], stepLen = a.beatLen / 4;
  const rows = emptyRows(16);
  const hits: Record<Inst, BarHit[]> = { kick: [], snare: [], ghost: [], hat: [] };
  const pickInst = (inst: Inst, onsets: Hit[], keepRatio: number) => {
    const inBar = onsets.filter((o) => o.t >= bar.start - stepLen / 2 && o.t < bar.end - stepLen / 2);
    const max = Math.max(0, ...inBar.map((o) => o.s));
    const byStep = new Map<number, Hit>();
    for (const o of inBar) {
      const step = Math.round((o.t - bar.start) / stepLen);
      if (step < 0 || step > 15) continue;
      const cur = byStep.get(step);
      if (!cur || o.s > cur.s) byStep.set(step, o);
    }
    byStep.forEach((o, step) => {
      const rel = max ? o.s / max : 0;
      if (rel < keepRatio) return;
      const dev = Math.round((o.t - (bar.start + step * stepLen)) * 1000);
      rows[inst][step] = true;
      hits[inst].push({ step, dev, rel });
    });
  };
  pickInst('kick', a.onsets.kick, 0.25);
  pickInst('snare', a.onsets.snare, 0.4);
  pickInst('ghost', a.onsets.ghost, 0);
  pickInst('hat', a.onsets.hat, 0);
  for (const s of hits.snare) {
    if (rows.ghost[s.step]) { rows.ghost[s.step] = false; hits.ghost = hits.ghost.filter((g) => g.step !== s.step); }
  }
  const mean = (arr: number[]) => (arr.length ? Math.round(arr.reduce((x, y) => x + y, 0) / arr.length) : 0);
  const clamp = (v: number) => Math.max(-40, Math.min(40, v));
  const evenDev = (list: BarHit[]) => list.filter((h) => h.step % 2 === 0).map((h) => h.dev);
  const devOf = (list: BarHit[]) => (evenDev(list).length ? evenDev(list) : list.map((h) => h.dev));
  const offsets: Offsets = {
    ...ZERO_OFFSETS,
    kick: clamp(mean(devOf(hits.kick))),
    snare: clamp(mean(devOf(hits.snare))),
    hat: clamp(mean(evenDev(hits.hat))),
  };
  offsets.ghost = offsets.snare;
  const oddHatDelay = mean(hits.hat.filter((h) => h.step % 2 === 1).map((h) => h.dev - offsets.hat));
  const swing = Math.round(Math.max(50, Math.min(75, 50 + 25 * (oddHatDelay / (0.5 * stepLen * 1000)))));
  for (const inst of Object.keys(hits) as Inst[]) hits[inst].sort((x, y) => x.step - y.step);
  return { rows, swing, offsets, hits };
}
