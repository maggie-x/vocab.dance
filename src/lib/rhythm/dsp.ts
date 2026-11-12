/** In-place iterative radix-2 FFT. Lengths must be a power of two. */
export function fft(re: Float32Array, im: Float32Array): void {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      let t = re[i]; re[i] = re[j]; re[j] = t;
      t = im[i]; im[i] = im[j]; im[j] = t;
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k, b = a + len / 2;
        const tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr;
        re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
        const ncr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = ncr;
      }
    }
  }
}

export const FFT_N = 2048;
export const HOP = 256;
export const FLUX_LAG = 2;
/** Hz ranges: kick, snare body, snare crack, hats. */
export const BANDS: Array<[number, number]> = [[35, 140], [150, 800], [1000, 4000], [6000, 16000]];

export interface BandFeatures {
  odf: Float32Array[];
  amp: Float32Array[];
  frames: number;
}

/**
 * Per-band onset strength after SuperFlux: positive differences of a log-magnitude spectrogram against a
 * frequency max-filtered frame `lag` hops earlier, summed within each band. Also per-band amplitude per frame.
 */
export function bandFeatures(
  data: Float32Array,
  sr: number,
  onProgress?: (fraction: number) => void,
  N = FFT_N,
  hop = HOP,
  lag = FLUX_LAG,
  bands = BANDS
): BandFeatures {
  const half = N / 2, binHz = sr / N, frames = Math.max(1, Math.floor((data.length - N) / hop));
  const win = new Float32Array(N);
  for (let i = 0; i < N; i++) win[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / N);
  const bins = bands.map(([lo, hi]) => [Math.max(1, Math.round(lo / binHz)), Math.min(half - 2, Math.round(hi / binHz))]);
  const odf = bands.map(() => new Float32Array(frames)), amp = bands.map(() => new Float32Array(frames));
  const re = new Float32Array(N), im = new Float32Array(N), mag = new Float32Array(half);
  const hist: Float32Array[] = [];
  for (let i = 0; i <= lag; i++) hist.push(new Float32Array(half));
  const scale = 4 / N;
  for (let f = 0; f < frames; f++) {
    const o = f * hop;
    for (let i = 0; i < N; i++) { re[i] = (data[o + i] || 0) * win[i]; im[i] = 0; }
    fft(re, im);
    const cur = hist[f % (lag + 1)], ref = hist[(f + 1) % (lag + 1)];
    for (let k = 0; k < half; k++) {
      mag[k] = Math.sqrt(re[k] * re[k] + im[k] * im[k]) * scale;
      cur[k] = Math.log1p(20 * mag[k]);
    }
    for (let b = 0; b < bins.length; b++) {
      let s = 0, en = 0;
      for (let k = bins[b][0]; k <= bins[b][1]; k++) {
        const d = cur[k] - Math.max(ref[k - 1], ref[k], ref[k + 1]);
        if (d > 0 && f >= lag) s += d;
        en += mag[k] * mag[k];
      }
      odf[b][f] = s; amp[b][f] = Math.sqrt(en);
    }
    if (onProgress && f % 4000 === 0) onProgress(f / frames);
  }
  return { odf, amp, frames };
}
