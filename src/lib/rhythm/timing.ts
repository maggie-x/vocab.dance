import { Inst, Offsets, RES, Res } from './patterns';

export const beatDur = (bpm: number): number => 60 / bpm;
export const stepDur = (bpm: number, res: Res): number => beatDur(bpm) / RES[res].steps;

/** Seconds an offbeat step is delayed by swing. 50% is straight, 75% is a full dotted feel. */
export function swingFor(step: number, swing: number, bpm: number, res: Res): number {
  const per = RES[res].steps;
  if (res === '12' || (step % per) % 2 === 0) return 0;
  return ((swing - 50) / 25) * 0.5 * stepDur(bpm, res);
}

/** Seconds a hit sounds after its grid cell: swing, the instrument offset and the cell's own nudge. */
export function hitDelay(step: number, inst: Inst, swing: number, offsets: Offsets, bpm: number, res: Res, nudgeMs = 0): number {
  return swingFor(step, swing, bpm, res) + (offsets[inst] + nudgeMs) / 1000;
}

/** Where a hit actually sounds relative to its grid cell, as a fraction of one step. */
export function hitShift(step: number, inst: Inst, swing: number, offsets: Offsets, bpm: number, res: Res, nudgeMs = 0): number {
  return hitDelay(step, inst, swing, offsets, bpm, res, nudgeMs) / stepDur(bpm, res);
}
