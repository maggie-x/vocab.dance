import { Bar } from './analysis';
import { Inst, INSTS, Nudges, Offsets, RES, Res, Rows, stepsPerBar } from './patterns';
import { DrumSynth } from './synth';
import { beatDur, hitDelay, stepDur } from './timing';

export type TrackMode = 'loop' | 'through';

export interface TrackPlayback {
  buffer: AudioBuffer;
  bars: Bar[];
  barIndex: number;
  bpm: number;
  beatLen: number;
  play: boolean;
  mode: TrackMode;
}

export interface EngineSnapshot {
  bpm: number;
  res: Res;
  bars: number;
  rows: Rows;
  mute: Record<Inst, boolean>;
  swing: number;
  offsets: Offsets;
  nudges: Nudges;
  metronome: boolean;
  track: TrackPlayback | null;
}

export type EngineEvent =
  | { type: 'step'; step: number; beat: number }
  | { type: 'bar'; index: number }
  | { type: 'end' }
  | { type: 'state'; playing: boolean };

type QueueItem = { time: number } & ({ step: number } | { bar: number } | { end: true });

const LOOKAHEAD = 0.15;

/**
 * Lookahead scheduler on the Web Audio clock. Reads the current pattern through `getState` each time it schedules a
 * step, so edits during playback take effect on the next pass, and reports step, bar and end events for the UI.
 */
export class Engine {
  audio: AudioContext | null = null;
  private synth: DrumSynth | null = null;
  playing = false;
  private timer: number | null = null;
  private raf = 0;
  private queue: QueueItem[] = [];
  private nextTime = 0;
  private currentStep = 0;
  private pausedStep = 0;
  nowStep = -1;
  private stepsScheduled = 0;
  private startBar = 0;
  private startStep = 0;
  private sources: AudioBufferSourceNode[] = [];

  constructor(private getState: () => EngineSnapshot, private onEvent: (e: EngineEvent) => void) {}

  ensureAudio(): AudioContext {
    if (!this.audio) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audio = new Ctor();
      this.synth = new DrumSynth(this.audio);
    }
    if (this.audio.state === 'suspended') void this.audio.resume();
    return this.audio;
  }

  async decode(data: ArrayBuffer): Promise<AudioBuffer> {
    return this.ensureAudio().decodeAudioData(data);
  }

  resetPosition(): void {
    this.pausedStep = 0;
  }

  start(): void {
    const audio = this.ensureAudio();
    const s = this.getState();
    this.playing = true;
    this.currentStep = this.pausedStep;
    this.queue = [];
    this.stepsScheduled = 0;
    this.nextTime = audio.currentTime + 0.08;
    if (s.track) {
      this.startBar = s.track.barIndex;
      this.startStep = this.currentStep;
      if (s.track.play && s.track.mode === 'through') this.startThrough(s, this.nextTime, this.currentStep);
    }
    this.timer = window.setInterval(() => this.schedule(), 25);
    this.raf = requestAnimationFrame(() => this.draw());
    this.onEvent({ type: 'state', playing: true });
  }

  pause(): void {
    if (!this.playing) return;
    const s = this.getState();
    this.playing = false;
    const total = stepsPerBar(s.res) * s.bars;
    this.pausedStep = this.nowStep >= 0 ? (this.nowStep + 1) % total : 0;
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
    cancelAnimationFrame(this.raf);
    this.stopTrackSources();
    this.queue = [];
    this.onEvent({ type: 'state', playing: false });
  }

  stop(): void {
    this.pause();
    this.pausedStep = 0;
    this.nowStep = -1;
    this.onEvent({ type: 'step', step: -1, beat: -1 });
  }

  /** Restart from the current position, for example when the track mix changes mid-play. */
  restart(): void {
    if (!this.playing) return;
    this.pause();
    this.start();
  }

  setTrackRate(): void {
    const s = this.getState();
    if (!s.track) return;
    for (const src of this.sources) src.playbackRate.value = s.bpm / s.track.bpm;
  }

  stopTrackSources(): void {
    for (const src of this.sources) { try { src.stop(); } catch { /* already stopped */ } }
    this.sources = [];
  }

  private trackSource(s: EngineSnapshot): AudioBufferSourceNode {
    const audio = this.audio as AudioContext;
    const track = s.track as TrackPlayback;
    const src = audio.createBufferSource();
    src.buffer = track.buffer;
    src.playbackRate.value = s.bpm / track.bpm;
    const g = audio.createGain();
    g.gain.value = 0.85;
    src.connect(g); g.connect(audio.destination);
    this.sources.push(src);
    src.onended = () => { this.sources = this.sources.filter((x) => x !== src); };
    return src;
  }

  /** Loop mode: a two-bar grid plays the chosen bar and the one after it in turn. */
  private startTrackBar(s: EngineSnapshot, t: number, gridBar: number): void {
    const track = s.track as TrackPlayback;
    const bar = track.bars[Math.min(track.barIndex + gridBar, track.bars.length - 1)];
    this.trackSource(s).start(t, bar.start, bar.end - bar.start);
  }

  private startThrough(s: EngineSnapshot, t: number, step: number): void {
    const track = s.track as TrackPlayback;
    const bar = track.bars[track.barIndex];
    const spb = stepsPerBar(s.res);
    const offset = bar.start + (step % spb) * ((track.beatLen * 4) / spb);
    this.trackSource(s).start(t, Math.min(offset, track.buffer.duration));
  }

  private scheduleStep(s: EngineSnapshot, step: number, t: number): void {
    const synth = this.synth as DrumSynth;
    const per = RES[s.res].steps;
    const spb = stepsPerBar(s.res);
    for (const inst of INSTS) {
      if (!s.rows[inst][step] || s.mute[inst]) continue;
      const at = t + hitDelay(step, inst, s.swing, s.offsets, s.bpm, s.res, s.nudges[inst][step] ?? 0);
      if (inst === 'kick') synth.kick(at);
      else if (inst === 'snare') synth.snare(at, 1);
      else if (inst === 'ghost') synth.snare(at, 0.3);
      else synth.hat(at, step % 2 === 1 ? 0.6 : 1);
    }
    if (s.metronome && step % per === 0) synth.click(t, step % spb === 0);
  }

  private schedule(): void {
    const audio = this.audio as AudioContext;
    while (this.nextTime < audio.currentTime + LOOKAHEAD) {
      const s = this.getState();
      const spb = stepsPerBar(s.res), total = spb * s.bars;
      if (s.track && s.track.play && this.currentStep % spb === 0) {
        if (s.track.mode === 'loop') this.startTrackBar(s, this.nextTime, Math.floor(this.currentStep / spb));
        else if (this.stepsScheduled > 0) {
          const idx = this.startBar + Math.floor((this.startStep + this.stepsScheduled) / spb);
          if (idx >= s.track.bars.length) {
            this.queue.push({ end: true, time: this.nextTime });
            this.nextTime = Infinity;
            break;
          }
          this.queue.push({ bar: idx, time: this.nextTime });
        }
      }
      this.scheduleStep(s, this.currentStep, this.nextTime);
      this.queue.push({ step: this.currentStep, time: this.nextTime });
      this.nextTime += stepDur(s.bpm, s.res);
      this.currentStep = (this.currentStep + 1) % total;
      this.stepsScheduled++;
    }
  }

  private draw(): void {
    if (!this.playing || !this.audio) return;
    const now = this.audio.currentTime;
    let last: { step: number } | null = null;
    while (this.queue.length && this.queue[0].time <= now) {
      const e = this.queue.shift() as QueueItem;
      if ('end' in e) { this.stop(); return; }
      if ('bar' in e) this.onEvent({ type: 'bar', index: e.bar });
      else last = e;
    }
    if (last) {
      const s = this.getState();
      this.nowStep = last.step;
      this.onEvent({ type: 'step', step: last.step, beat: Math.floor((last.step % stepsPerBar(s.res)) / RES[s.res].steps) });
    }
    this.raf = requestAnimationFrame(() => this.draw());
  }

  /** Keeps the paused position valid after the pattern length changes. */
  clampPosition(): void {
    const s = this.getState();
    const total = stepsPerBar(s.res) * s.bars;
    this.pausedStep = this.pausedStep % total;
    this.currentStep = this.currentStep % total;
  }

  beatLength(): number {
    return beatDur(this.getState().bpm);
  }
}
