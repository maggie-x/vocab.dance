import { bandFeatures, fft } from './dsp';

describe('fft', () => {
  it('puts a pure tone in the right bin', () => {
    const n = 1024, sr = 48000, f = 1500;
    const re = new Float32Array(n), im = new Float32Array(n);
    for (let i = 0; i < n; i++) re[i] = Math.sin((2 * Math.PI * f * i) / sr);
    fft(re, im);
    let best = 0;
    for (let k = 1; k < n / 2; k++) if (Math.hypot(re[k], im[k]) > Math.hypot(re[best], im[best])) best = k;
    expect(best).toBe(Math.round((f / sr) * n));
  });
});

describe('bandFeatures', () => {
  it('shows a low-band onset where a kick starts and a top-band onset where a hat starts', () => {
    const sr = 48000, len = sr;
    const data = new Float32Array(len);
    const kickAt = 0.3, hatAt = 0.7;
    for (let i = 0; i < len; i++) {
      const t = i / sr;
      if (t >= kickAt && t < kickAt + 0.2) data[i] += Math.sin(2 * Math.PI * 60 * (t - kickAt)) * Math.exp(-(t - kickAt) * 10);
      if (t >= hatAt && t < hatAt + 0.05) data[i] += (Math.random() * 2 - 1) * 0.3 * Math.exp(-(t - hatAt) * 60);
    }
    const { odf, frames } = bandFeatures(data, sr);
    const peakFrame = (arr: Float32Array) => { let b = 0; for (let i = 0; i < frames; i++) if (arr[i] > arr[b]) b = i; return b; };
    const frameTime = (f: number) => (f * 256 + 1024) / sr;
    expect(Math.abs(frameTime(peakFrame(odf[0])) - kickAt)).toBeLessThan(0.02);
    expect(Math.abs(frameTime(peakFrame(odf[3])) - hatAt)).toBeLessThan(0.012);
  });
});
