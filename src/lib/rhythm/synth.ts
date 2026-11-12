/**
 * Synthesised drums in the spirit of a dusty 12-bit sampler: every drum runs through soft saturation and a dark
 * top end. Nothing is loaded from disk.
 */
export class DrumSynth {
  private noise: AudioBuffer;
  private bus: GainNode;

  constructor(private audio: AudioContext) {
    const len = audio.sampleRate;
    this.noise = audio.createBuffer(1, len, audio.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.bus = audio.createGain();
    this.bus.gain.value = 0.8;
    const shaper = audio.createWaveShaper();
    shaper.oversample = '2x';
    const curve = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) {
      const x = i / 511.5 - 1;
      curve[i] = Math.tanh(x * 1.8) / Math.tanh(1.8);
    }
    shaper.curve = curve;
    const dark = audio.createBiquadFilter();
    dark.type = 'lowpass'; dark.frequency.value = 8500; dark.Q.value = 0.6;
    this.bus.connect(shaper); shaper.connect(dark); dark.connect(audio.destination);
  }

  private env(t: number, a: number, d: number, peak: number, dest: AudioNode = this.bus): GainNode {
    const g = this.audio.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
    g.connect(dest);
    return g;
  }

  private noiseSource(t: number, dur: number): AudioBufferSourceNode {
    const n = this.audio.createBufferSource();
    n.buffer = this.noise;
    n.loop = true;
    n.loopStart = Math.random() * 0.5;
    n.loopEnd = n.loopStart + 0.4;
    n.start(t, n.loopStart);
    n.stop(t + dur);
    return n;
  }

  private filter(type: BiquadFilterType, f: number, q = 0.7): BiquadFilterNode {
    const b = this.audio.createBiquadFilter();
    b.type = type; b.frequency.value = f; b.Q.value = q;
    return b;
  }

  private sweep(type: OscillatorType, f0: number, f1: number, t: number, dur: number): OscillatorNode {
    const o = this.audio.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    return o;
  }

  private chain(src: AudioNode, ...nodes: AudioNode[]): void {
    let cur = src;
    for (const n of nodes) { cur.connect(n); cur = n; }
  }

  kick(t: number): void {
    const body = this.sweep('sine', 125, 46, t, 0.06);
    this.chain(body, this.env(t, 0.002, 0.36, 1.25));
    body.start(t); body.stop(t + 0.5);
    const knock = this.sweep('triangle', 260, 90, t, 0.02);
    this.chain(knock, this.env(t, 0.001, 0.03, 0.4));
    knock.start(t); knock.stop(t + 0.08);
    this.chain(this.noiseSource(t, 0.03), this.filter('highpass', 2500), this.env(t, 0.001, 0.012, 0.3));
  }

  snare(t: number, level = 1): void {
    const tail = level < 0.5 ? 0.17 : 0.3;
    const body = this.sweep('triangle', 200, 158, t, 0.05);
    this.chain(body, this.env(t, 0.002, 0.2, 0.55 * level));
    body.start(t); body.stop(t + 0.3);
    const tone = this.sweep('sine', 340, 245, t, 0.04);
    this.chain(tone, this.env(t, 0.002, 0.11, 0.3 * level));
    tone.start(t); tone.stop(t + 0.2);
    this.chain(this.noiseSource(t, tail + 0.05), this.filter('bandpass', 1700, 0.5), this.env(t, 0.001, tail, 0.95 * level));
    this.chain(this.noiseSource(t, tail), this.filter('bandpass', 420, 1.2), this.env(t, 0.002, tail * 0.6, 0.5 * level));
    this.chain(this.noiseSource(t, tail * 1.4), this.filter('bandpass', 1050, 12), this.env(t, 0.004, tail * 1.3, 0.5 * level));
  }

  hat(t: number, level = 1): void {
    this.chain(this.noiseSource(t, 0.08), this.filter('highpass', 5500), this.filter('bandpass', 8200, 1.6), this.env(t, 0.001, 0.055, 0.42 * level));
    this.chain(this.noiseSource(t, 0.04), this.filter('highpass', 7500), this.env(t, 0.001, 0.025, 0.18 * level));
  }

  click(t: number, accent: boolean): void {
    const o = this.audio.createOscillator();
    o.type = 'square';
    o.frequency.value = accent ? 1600 : 1000;
    const g = this.env(t, 0.001, 0.03, accent ? 0.3 : 0.18, this.audio.destination);
    o.connect(g); o.start(t); o.stop(t + 0.06);
  }
}
