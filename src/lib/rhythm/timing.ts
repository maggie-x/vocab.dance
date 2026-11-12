import { Inst, Offsets, RES, Res } from './patterns';

export const beatDur = (bpm: number): number => 60 / bpm;
export const stepDur = (bpm: number, res: Res): number => beatDur(bpm) / RES[res].steps;

/** Seconds an offbeat step is delayed by swing. 50% is straight, 75% is a full dotted feel. */
export function swingFor(step: number, swing: number, bpm: number, res: Res): number {
  const per = RES[res].steps;
  if (res === '12' || (step % per) % 2 === 0) return 0;
  return ((swing - 50) / 25) * 0.5 * stepDur(bpm, res);
}

/** Where a hit actually sounds relative to its grid cell, as a fraction of one step. */
export function hitShift(step: number, inst: Inst, swing: number, offsets: Offsets, bpm: number, res: Res): number {
  return (swingFor(step, swing, bpm, res) + offsets[inst] / 1000) / stepDur(bpm, res);
}
