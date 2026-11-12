import { buildBars, chooseBarStart, classifyEvents, coarseTempo, detectBar, DrumEvent, DrumOnsets, firstBarWithDrums, fitGrid, Hit, impulseTrain, pickPeaks, TrackAnalysis } from './analysis';
import { HOP } from './dsp';
import { busiestBar } from './analysis';

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
    expect(det.offGrid).toBe(0);
    expect(det.nudges.kick.every((n) => n === 0)).toBe(true);
  });
  it('gives a straight kick on a swung grid a nudge that cancels the swing', () => {
    const bpm = 90, beat = 60 / bpm, start = 0.5, step = beat / 4;
    const o = backbeat(bpm, 2, start);
    const hit = (t: number, s = 1): Hit => ({ i: Math.round((t * SR) / HOP), t, s });
    const bar2 = start + 4 * beat;
    // Hats swung 66%: odd 16ths a third of a step late. One kick exactly on the "e" of 3, unswung.
    o.hat = Array.from({ length: 16 }, (_, s) => hit(bar2 + s * step + (s % 2 ? step / 3 : 0), 0.5));
    o.kick.push(hit(bar2 + 9 * step));
    const a: TrackAnalysis = { bpm, beatLen: beat, phase: start, bars: buildBars(start, beat, 20), onsets: o, duration: 20 };
    const det = detectBar(a, 1);
    expect(det.swing).toBeGreaterThanOrEqual(65);
    expect(det.rows.kick[9]).toBe(true);
    const swingMs = Math.round(((det.swing - 50) / 25) * 0.5 * step * 1000);
    expect(det.nudges.kick[9] + swingMs + det.offsets.kick).toBe(0);
  });
  it('detects two consecutive bars into a 32-step grid', () => {
    const bpm = 90, beat = 60 / bpm, start = 0.5;
    const o = backbeat(bpm, 4, start);
    const a: TrackAnalysis = { bpm, beatLen: beat, phase: start, bars: buildBars(start, beat, 20), onsets: o, duration: 20 };
    const det = detectBar(a, 1, 2);
    expect(det.rows.kick).toHaveLength(32);
    expect(det.rows.kick.map((v, i) => (v ? i : -1)).filter((i) => i >= 0)).toEqual([0, 8, 16, 24]);
    expect(det.rows.snare.map((v, i) => (v ? i : -1)).filter((i) => i >= 0)).toEqual([4, 12, 20, 28]);
    const last = detectBar(a, 3, 2);
    expect(last.rows.kick.slice(16).some(Boolean)).toBe(false);
  });
  it('reads triplet hats onto the triplet grid', () => {
    const bpm = 90, beat = 60 / bpm, start = 0.5;
    const o = backbeat(bpm, 2, start);
    const hit = (t: number): Hit => ({ i: Math.round((t * SR) / HOP), t, s: 0.5 });
    const bar2 = start + 4 * beat;
    o.hat = [];
    for (let b = 0; b < 4; b++) for (let k = 0; k < 3; k++) o.hat.push(hit(bar2 + b * beat + (k * beat) / 3));
    const a: TrackAnalysis = { bpm, beatLen: beat, phase: start, bars: buildBars(start, beat, 20), onsets: o, duration: 20 };
    const trip = detectBar(a, 1, 1, '12');
    expect(trip.rows.hat).toHaveLength(12);
    expect(trip.rows.hat.every(Boolean)).toBe(true);
    expect(trip.rows.kick.map((v, i) => (v ? i : -1)).filter((i) => i >= 0)).toEqual([0, 6]);
    expect(trip.rows.snare.map((v, i) => (v ? i : -1)).filter((i) => i >= 0)).toEqual([3, 9]);
    expect(trip.offGrid).toBe(0);
    expect(trip.swing).toBe(50);
    expect(trip.nudges.hat.every((n) => Math.abs(n) <= 3)).toBe(true);
  });
  it('keeps triplet hats on the 16th grid in the nearest cell with their true timing as nudges', () => {
    const bpm = 90, beat = 60 / bpm, start = 0.5, step = beat / 4;
    const o = backbeat(bpm, 2, start);
    const hit = (t: number): Hit => ({ i: Math.round((t * SR) / HOP), t, s: 0.5 });
    const bar2 = start + 4 * beat;
    o.hat = [];
    for (let b = 0; b < 4; b++) for (let k = 0; k < 3; k++) o.hat.push(hit(bar2 + b * beat + (k * beat) / 3));
    const a: TrackAnalysis = { bpm, beatLen: beat, phase: start, bars: buildBars(start, beat, 20), onsets: o, duration: 20 };
    const det = detectBar(a, 1, 1, '16');
    // 0, 1.33, 2.67 of each beat -> cells 0, 1 and 3; nothing is lost.
    expect(det.rows.hat.filter(Boolean)).toHaveLength(12);
    expect(det.rows.hat.map((v, i) => (v ? i : -1)).filter((i) => i >= 0)).toEqual([0, 1, 3, 4, 5, 7, 8, 9, 11, 12, 13, 15]);
    expect(det.offGrid).toBe(0);
    // Playback time = step + swing + hat offset + nudge must land on the true triplet position.
    const swingMs = (s: number) => (s % 2 === 1 ? ((det.swing - 50) / 25) * 0.5 * step * 1000 : 0);
    const played = (s: number) => s * step * 1000 + swingMs(s) + det.offsets.hat + det.nudges.hat[s];
    expect(Math.abs(played(1) - (beat / 3) * 1000)).toBeLessThan(3);
    expect(Math.abs(played(3) - ((2 * beat) / 3) * 1000)).toBeLessThan(3);
  });
  it('counts a hit that loses its cell to a stronger one', () => {
    const bpm = 90, beat = 60 / bpm, start = 0.5, step = beat / 4;
    const o = backbeat(bpm, 2, start);
    const bar2 = start + 4 * beat;
    // Both round to the beat cell; the louder one keeps it.
    o.hat = [{ i: 0, t: bar2 + step * 0.2, s: 0.9 }, { i: 0, t: bar2 + step * 0.45, s: 0.3 }].map((h) => ({ ...h, i: Math.round((h.t * SR) / HOP) }));
    const a: TrackAnalysis = { bpm, beatLen: beat, phase: start, bars: buildBars(start, beat, 20), onsets: o, duration: 20 };
    const det = detectBar(a, 1, 1, '16');
    expect(det.rows.hat.filter(Boolean)).toHaveLength(1);
    expect(det.offGrid).toBe(1);
  });
});

describe('pickPeaks at the start of a file', () => {
  it('counts a hit that is already sounding at time zero', () => {
    const n = 200;
    const odf = new Float32Array(n), amp = new Float32Array(n);
    for (let i = 0; i < n; i++) amp[i] = Math.exp(-i / 8);
    const peaks = pickPeaks(odf, amp, SR);
    expect(peaks[0]).toMatchObject({ i: 0, t: 0 });
    expect(peaks[0].s).toBeCloseTo(1, 5);
    expect(peaks[0].sus).toBeLessThan(0.1);
  });
  it('does not invent one when the file opens quiet', () => {
    const n = 200;
    const odf = new Float32Array(n), amp = new Float32Array(n).fill(0.1);
    expect(pickPeaks(odf, amp, SR)).toHaveLength(0);
  });
});

describe('firstBarWithDrums', () => {
  it('skips a quiet lead-in and lands on the first bar with drums', () => {
    const bpm = 90, beat = 60 / bpm;
    const o = backbeat(bpm, 4, 0.5 + 8 * beat);
    const a: TrackAnalysis = { bpm, beatLen: beat, phase: 0.5, bars: buildBars(0.5, beat, 40), onsets: o, duration: 40 };
    expect(firstBarWithDrums(a)).toBe(2);
    expect(busiestBar(a)).toBeGreaterThanOrEqual(2);
  });
});

describe('classifyEvents', () => {
  const ev = (partial: Partial<DrumEvent> & { n: number[] }): DrumEvent => ({ i: 0, r: [], cs: 0, ts: 0, snareLike: false, ...partial });
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
  it('counts a bright event as a hat unless it sustains like sibilance', () => {
    const out = classifyEvents([ev({ hat: onset(1), n: [0, 0.02, 0.1, 0.6], ts: 0.1 })]);
    expect(out.hat).toHaveLength(1);
    expect(classifyEvents([ev({ hat: onset(1), n: [0, 0.02, 0.1, 0.1], ts: 0.1 })]).hat).toHaveLength(0);
    expect(classifyEvents([ev({ hat: onset(1), n: [0, 0.1, 0.15, 0.4], ts: 0.95 })]).hat).toHaveLength(0);
  });
  it('takes a body-less snare from the top-band detector when the crack is strong', () => {
    const out = classifyEvents([ev({ hat: onset(1), snareLike: true, n: [0, 0.03, 0.9, 1.0], cs: 0.5 })]);
    expect(out.snare).toHaveLength(1);
  });
});
