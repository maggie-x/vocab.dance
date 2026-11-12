import { buildBars, chooseBarStart, classifyEvents, coarseTempo, detectBar, DrumEvent, DrumOnsets, fitGrid, Hit, impulseTrain, TrackAnalysis } from './analysis';
import { HOP } from './dsp';

const SR = 48000;
const FR = SR / HOP;

/** Hits at a steady tempo: kick on 1 and 3, snare on 2 and 4, over many bars. */
function backbeat(bpm: number, bars: number, start = 0.4, kickLate = 0, snareEarly = 0): DrumOnsets {
  const beat = 60 / bpm;
  const hit = (t: number, s: number): Hit => ({ i: Math.round((t * SR) / HOP), t, s });
  const kick: Hit[] = [], snare: Hit[] = [], hat: Hit[] = [];
  for (let b = 0; b < bars; b++) {
    const t0 = start + b * 4 * beat;
    kick.push(hit(t0 + kickLate, 1), hit(t0 + 2 * beat + kickLate, 0.9));
    snare.push(hit(t0 + beat - snareEarly, 1), hit(t0 + 3 * beat - snareEarly, 1));
    for (let s = 0; s < 8; s++) hat.push(hit(t0 + (s * beat) / 2, 0.5));
  }
  return { kick, snare, ghost: [], hat };
}

describe('coarseTempo', () => {
  it('finds the tempo of a steady backbeat', () => {
    const o = backbeat(93, 24);
    const n = Math.round(o.hat[o.hat.length - 1].t * FR) + 10;
    const comb = impulseTrain(o.kick, n).map((v, i) => v + impulseTrain(o.snare, n)[i]);
    expect(coarseTempo(comb, FR)).toBeCloseTo(93, 0);
  });
  it('folds a slow reading into the hip-hop range', () => {
    const o = backbeat(70, 24);
    const n = Math.round(o.hat[o.hat.length - 1].t * FR) + 10;
    const comb = impulseTrain(o.kick, n).map((v, i) => v + impulseTrain(o.snare, n)[i]);
    const bpm = coarseTempo(comb, FR);
    expect(bpm).toBeGreaterThanOrEqual(62);
    expect(bpm).toBeLessThanOrEqual(135);
  });
});

describe('fitGrid and chooseBarStart', () => {
  it('refines the tempo to within a hundredth of a BPM and finds the downbeat', () => {
    const o = backbeat(93.7, 16, 0.37);
    const g = fitGrid([...o.kick, ...o.snare, ...o.hat], 92, 0.04);
    expect(Math.abs(g.bpm - 93.7)).toBeLessThan(0.02);
    const start = chooseBarStart(o, g.step, g.phaseStep);
    const barLen = (60 / 93.7) * 4;
    const diff = ((start - 0.37) % barLen + barLen) % barLen;
    expect(Math.min(diff, barLen - diff)).toBeLessThan(0.01);
  });
});

describe('detectBar', () => {
  it('snaps hits to the grid and reports timing per instrument', () => {
    const bpm = 90, beat = 60 / bpm;
    const o = backbeat(bpm, 4, 0.5, 0.02, 0.02);
    const a: TrackAnalysis = { bpm, beatLen: beat, phase: 0.5, bars: buildBars(0.5, beat, 0.5 + 4 * 4 * beat + 1), onsets: o, duration: 20 };
    const det = detectBar(a, 1);
    expect(det.rows.kick.map((v, i) => (v ? i : -1)).filter((i) => i >= 0)).toEqual([0, 8]);
    expect(det.rows.snare.map((v, i) => (v ? i : -1)).filter((i) => i >= 0)).toEqual([4, 12]);
    expect(det.rows.hat.filter(Boolean)).toHaveLength(8);
    expect(det.offsets.kick).toBe(20);
    expect(det.offsets.snare).toBe(-20);
    expect(det.swing).toBe(50);
  });
});

describe('classifyEvents', () => {
  const ev = (partial: Partial<DrumEvent> & { n: number[] }): DrumEvent => ({ i: 0, r: [], cs: 0, snareLike: false, ...partial });
  const onset = (t: number, sus = 0) => ({ i: Math.round((t * SR) / HOP), t, s: 1, sus });

  it('keeps a kick with a punchy low rise and some attack', () => {
    const out = classifyEvents([ev({ low: onset(1), n: [1, 0.4, 0.1, 0.05] })]);
    expect(out.kick).toHaveLength(1);
  });
  it('rejects a bass note that sustains and a low wobble with no attack', () => {
    expect(classifyEvents([ev({ low: onset(1, 0.95), n: [1, 0.4, 0.1, 0] })]).kick).toHaveLength(0);
    expect(classifyEvents([ev({ low: onset(1, 0.3), n: [0.5, 0.01, 0, 0] })]).kick).toHaveLength(0);
  });
  it('splits snares from ghosts by crack level', () => {
    const out = classifyEvents([
      ev({ mid: onset(1), snareLike: true, n: [0.1, 0.5, 1, 0.9] }),
      ev({ mid: onset(2), snareLike: true, n: [0.05, 0.2, 0.3, 0.4] }),
    ]);
    expect(out.snare).toHaveLength(1);
    expect(out.ghost).toHaveLength(1);
  });
  it('counts a bright event as a hat', () => {
    const out = classifyEvents([ev({ hat: onset(1), n: [0, 0.02, 0.1, 0.6] })]);
    expect(out.hat).toHaveLength(1);
    expect(classifyEvents([ev({ hat: onset(1), n: [0, 0.02, 0.1, 0.1] })]).hat).toHaveLength(0);
  });
});
