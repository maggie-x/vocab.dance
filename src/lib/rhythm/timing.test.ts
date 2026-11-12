import { ZERO_OFFSETS } from './patterns';
import { hitShift, stepDur, swingFor } from './timing';

describe('swingFor', () => {
  it('is zero when straight and on even steps', () => {
    expect(swingFor(1, 50, 90, '16')).toBe(0);
    expect(swingFor(0, 66, 90, '16')).toBe(0);
    expect(swingFor(2, 66, 90, '16')).toBe(0);
  });
  it('delays the e and a of a 16th grid by up to half a step at 75%', () => {
    const step = stepDur(90, '16');
    expect(swingFor(1, 75, 90, '16')).toBeCloseTo(step / 2, 6);
    expect(swingFor(3, 62.5, 90, '16')).toBeCloseTo(step / 4, 6);
  });
  it('does not swing triplets', () => {
    expect(swingFor(1, 75, 90, '12')).toBe(0);
  });
});

describe('hitShift', () => {
  it('turns a millisecond offset into a fraction of a step', () => {
    const step = stepDur(90, '16');
    expect(hitShift(0, 'snare', 50, { ...ZERO_OFFSETS, snare: -25 }, 90, '16')).toBeCloseTo(-0.025 / step, 6);
  });
  it('adds swing and instrument offset together', () => {
    const step = stepDur(90, '16');
    const shift = hitShift(1, 'hat', 75, { ...ZERO_OFFSETS, hat: 10 }, 90, '16');
    expect(shift).toBeCloseTo(0.5 + 0.01 / step, 6);
  });
});
