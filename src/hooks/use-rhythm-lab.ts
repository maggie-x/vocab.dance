import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalStorage } from 'react-use';
import {
  analyseAudio,
  BarHit,
  detectBar,
  busiestBar,
  fitTempo,
  shiftPhase,
  TrackAnalysis,
} from '../lib/rhythm/analysis';
import { BandFeatures } from '../lib/rhythm/dsp';
import { Engine, EngineEvent, EngineSnapshot, TrackMode } from '../lib/rhythm/engine';
import {
  cloneNudges,
  cloneRows,
  configFrom,
  emptyNudges,
  emptyRows,
  HEAR_SETS,
  HearMode,
  Inst,
  Nudges,
  Offsets,
  PatternConfig,
  PRESETS,
  remapRows,
  Res,
  resizeBars,
  resizeNudges,
  Rows,
  stepsPerBar,
  ZERO_OFFSETS,
} from '../lib/rhythm/patterns';
import { configToSaved, SavedRhythm, savedToConfig, savedToJson } from '../lib/rhythm/saved';

export interface LabState {
  name: string;
  purpose: string;
  res: Res;
  bars: number;
  rows: Rows;
  swing: number;
  offsets: Offsets;
  nudges: Nudges;
  bpm: number;
  mute: Record<Inst, boolean>;
  metronome: boolean;
  mystery: string | null;
}

export interface TrackState {
  name: string;
  buffer: AudioBuffer;
  analysis: TrackAnalysis;
  barIndex: number;
  hits: Record<Inst, BarHit[]> | null;
  offGrid: number;
  play: boolean;
  mode: TrackMode;
}

export interface SavedPattern {
  name: string;
  res: Res;
  bars: number;
  rows: Rows;
  swing: number;
  offsets: Offsets;
  nudges?: Nudges;
}

export type TrackHear = 'track' | 'drums' | 'both';

const initialConfig = configFrom('boom');

const initialState: LabState = {
  name: initialConfig.name,
  purpose: initialConfig.purpose,
  res: '16',
  bars: 1,
  rows: initialConfig.rows,
  swing: 50,
  offsets: { ...ZERO_OFFSETS },
  nudges: emptyNudges(16),
  bpm: 90,
  mute: { ...HEAR_SETS.all },
  metronome: false,
  mystery: null,
};

function runFeatures(mono: Float32Array, sr: number, onProgress: (f: number) => void): Promise<BandFeatures> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../lib/rhythm/analysis.worker.ts', import.meta.url));
    worker.onmessage = (e: MessageEvent) => {
      if (e.data.progress !== undefined) { onProgress(e.data.progress); return; }
      worker.terminate();
      resolve(e.data as BandFeatures);
    };
    worker.onerror = (err) => { worker.terminate(); reject(err); };
    worker.postMessage({ data: mono, sr }, [mono.buffer]);
  });
}

export function useRhythmLab() {
  const [state, setState] = useState<LabState>(initialState);
  const [track, setTrack] = useState<TrackState | null>(null);
  const [trackStatus, setTrackStatus] = useState('Nothing leaves your browser. Works best on loops with clear drums.');
  const [playing, setPlaying] = useState(false);
  const [nowStep, setNowStep] = useState(-1);
  const [beat, setBeat] = useState(-1);
  const [toast, setToastText] = useState<string | null>(null);
  const [mine = [], setMine] = useLocalStorage<SavedPattern[]>('rhythm.mine', []);

  const stateRef = useRef(state);
  const trackRef = useRef(track);
  stateRef.current = state;
  trackRef.current = track;

  const toastTimer = useRef<number | null>(null);
  const showToast = useCallback((text: string) => {
    setToastText(text);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastText(null), 1800);
  }, []);

  const engine = useMemo(() => {
    const getState = (): EngineSnapshot => {
      const s = stateRef.current, t = trackRef.current;
      return {
        bpm: s.bpm, res: s.res, bars: s.bars, rows: s.rows, mute: s.mute, swing: s.swing, offsets: s.offsets, nudges: s.nudges, metronome: s.metronome,
        track: t ? { buffer: t.buffer, bars: t.analysis.bars, barIndex: t.barIndex, bpm: t.analysis.bpm, beatLen: t.analysis.beatLen, play: t.play, mode: t.mode } : null,
      };
    };
    const onEvent = (e: EngineEvent) => {
      if (e.type === 'step') { setNowStep(e.step); setBeat(e.beat); }
      else if (e.type === 'bar') setTrack((t) => (t ? { ...t, barIndex: e.index } : t));
      else if (e.type === 'state') { setPlaying(e.playing); if (!e.playing) setBeat(-1); }
    };
    return new Engine(getState, onEvent);
  }, []);

  useEffect(() => () => engine.stop(), [engine]);

  const play = useCallback(() => engine.start(), [engine]);
  const pause = useCallback(() => engine.pause(), [engine]);
  const stop = useCallback(() => engine.stop(), [engine]);
  const togglePlay = useCallback(() => (engine.playing ? engine.pause() : engine.start()), [engine]);

  // Writes that the engine must see before the next render also update the ref directly.
  const updateTrack = useCallback((patch: Partial<TrackState>) => {
    const t = trackRef.current;
    if (!t) return;
    const next = { ...t, ...patch };
    trackRef.current = next;
    setTrack(next);
  }, []);

  /** Make the grid audible on its own: every row on, the track (if any) silent but still loaded. */
  const soloGrid = useCallback(() => {
    setState((s) => ({ ...s, mute: { ...HEAR_SETS.all } }));
    const t = trackRef.current;
    if (t && t.play) { updateTrack({ play: false }); engine.stopTrackSources(); }
  }, [engine, updateTrack]);

  const loadConfig = useCallback((cfg: PatternConfig, opts: { toast?: boolean; keepMystery?: boolean } = {}) => {
    engine.resetPosition();
    setState((s) => ({
      ...s,
      name: cfg.name,
      purpose: cfg.purpose,
      res: cfg.res,
      bars: cfg.bars,
      rows: cloneRows(cfg.rows),
      swing: cfg.swing,
      offsets: { ...ZERO_OFFSETS, ...cfg.offsets },
      nudges: cfg.nudges ? cloneNudges(cfg.nudges) : emptyNudges(stepsPerBar(cfg.res) * cfg.bars),
      mystery: opts.keepMystery ? s.mystery : null,
    }));
    if (opts.toast !== false) showToast(`Loaded: ${cfg.name}`);
  }, [engine, showToast]);

  const loadAndPlay = useCallback((cfg: PatternConfig, opts: { toast?: boolean } = {}) => {
    soloGrid();
    loadConfig(cfg, opts);
    if (!engine.playing) engine.start();
  }, [engine, loadConfig, soloGrid]);

  const setBpm = useCallback((bpm: number) => { setState((s) => ({ ...s, bpm })); window.setTimeout(() => engine.setTrackRate(), 0); }, [engine]);
  const setSwing = useCallback((swing: number) => setState((s) => ({ ...s, swing })), []);
  const setMetronome = useCallback((metronome: boolean) => setState((s) => ({ ...s, metronome })), []);

  const toggleCell = useCallback((inst: Inst, step: number) => {
    setState((s) => {
      const rows = cloneRows(s.rows), nudges = cloneNudges(s.nudges);
      rows[inst][step] = !rows[inst][step];
      nudges[inst][step] = 0;
      const name = s.name && !s.name.endsWith(' (edited)') ? `${s.name} (edited)` : s.name;
      return { ...s, rows, nudges, name, mystery: null };
    });
  }, []);

  const toggleMute = useCallback((inst: Inst) => setState((s) => ({ ...s, mute: { ...s.mute, [inst]: !s.mute[inst] } })), []);
  const setHear = useCallback((mode: HearMode) => setState((s) => ({ ...s, mute: { ...HEAR_SETS[mode] } })), []);

  const setRes = useCallback((res: Res) => {
    setState((s) => (s.res === res ? s : { ...s, res, rows: remapRows(s.rows, s.res, res, s.bars), nudges: emptyNudges(stepsPerBar(res) * s.bars) }));
    window.setTimeout(() => engine.clampPosition(), 0);
  }, [engine]);

  const clear = useCallback(() => {
    setState((s) => ({ ...s, rows: emptyRows(stepsPerBar(s.res) * s.bars), nudges: emptyNudges(stepsPerBar(s.res) * s.bars), name: 'Blank', purpose: 'Build your own. Start with a kick on 1 and a snare on 2 and 4.', mystery: null }));
  }, []);

  const saveMine = useCallback((name: string) => {
    const s = stateRef.current;
    const saved: SavedPattern = { name, res: s.res, bars: s.bars, rows: cloneRows(s.rows), swing: s.swing, offsets: { ...s.offsets }, nudges: cloneNudges(s.nudges) };
    setMine([...mine, saved]);
    setState((st) => ({ ...st, name }));
    showToast(`Saved: ${name}`);
  }, [mine, setMine, showToast]);

  const loadSaved = useCallback((p: SavedPattern) => {
    loadAndPlay({ name: p.name, purpose: 'Saved in this browser.', res: p.res, bars: p.bars, rows: p.rows, swing: p.swing, offsets: p.offsets, nudges: p.nudges });
  }, [loadAndPlay]);

  const loadSavedRhythm = useCallback((r: SavedRhythm) => {
    const cfg = savedToConfig(r);
    setState((s) => ({ ...s, bpm: Math.round(cfg.bpm) }));
    loadAndPlay(cfg);
  }, [loadAndPlay]);

  /** Copies the current grid as a rhythms.json entry with an empty source. */
  const copyAsJson = useCallback(async () => {
    const s = stateRef.current;
    const json = savedToJson(configToSaved({ name: s.name, res: s.res, bars: s.bars, rows: s.rows, swing: s.swing, offsets: s.offsets, nudges: s.nudges, bpm: s.bpm }));
    try {
      await navigator.clipboard.writeText(json);
      showToast('Copied. Paste into src/data/rhythms.json and fill in the source.');
    } catch {
      showToast('Could not copy in this browser.');
    }
    return json;
  }, [showToast]);

  const startMystery = useCallback(() => {
    const current = stateRef.current.mystery;
    const choices = PRESETS.filter((p) => p.id !== current);
    const pick = choices[Math.floor(Math.random() * choices.length)];
    soloGrid();
    loadConfig(configFrom(pick.id), { toast: false, keepMystery: true });
    setState((s) => ({ ...s, mystery: pick.id, name: 'Mystery pattern' }));
    if (!engine.playing) engine.start();
  }, [engine, loadConfig, soloGrid]);

  const answerMystery = useCallback((id: string): { correct: boolean; answer: string } | null => {
    const current = stateRef.current.mystery;
    if (!current) return null;
    const preset = PRESETS.find((p) => p.id === current);
    setState((s) => ({ ...s, mystery: null, name: preset ? preset.name : s.name }));
    return { correct: id === current, answer: preset ? preset.name : '' };
  }, []);

  // ---- Track analysis ----
  const barLabel = (t: TrackState, barIndex: number, bars: number): string =>
    bars === 2 && barIndex + 1 < t.analysis.bars.length ? `bars ${barIndex + 1}–${barIndex + 2}` : `bar ${barIndex + 1}`;

  const applyDetection = useCallback((t: TrackState, barIndex: number, bars = stateRef.current.bars): TrackState => {
    const det = detectBar(t.analysis, barIndex, bars);
    setState((s) => ({ ...s, bpm: Math.round(t.analysis.bpm) }));
    loadConfig({
      name: `${t.name} · ${barLabel(t, barIndex, bars)}`,
      purpose: 'Detected from your audio. Kick from the low band, snare from the mid band, hats from the top. Fix anything that sounds wrong by clicking cells.',
      res: '16', bars, rows: det.rows, swing: det.swing, offsets: det.offsets, nudges: det.nudges,
    }, { toast: false });
    setTrackStatus(`${t.name}: ${t.analysis.bpm} BPM detected. Grid shows what was heard in ${barLabel(t, barIndex, bars)}.`);
    return { ...t, barIndex, hits: det.hits, offGrid: det.offGrid };
  }, [loadConfig]);

  /** True while the grid still holds a detection as it came out of the analyser. */
  const gridIsDetection = () => {
    const t = trackRef.current, s = stateRef.current;
    return !!t && s.name.startsWith(`${t.name} · bar`) && !s.name.endsWith(' (edited)');
  };

  /** One or two bars. With an untouched detection in the grid, re-reads that many bars from the track. */
  const setBars = useCallback((bars: number) => {
    if (stateRef.current.bars === bars) return;
    const t = trackRef.current;
    if (t && gridIsDetection()) {
      engine.stop();
      setState((s) => ({ ...s, bars }));
      setTrack(applyDetection(t, t.barIndex, bars));
      return;
    }
    setState((s) => ({ ...s, bars, rows: resizeBars(s.rows, s.res, bars), nudges: resizeNudges(s.nudges, s.res, bars) }));
    window.setTimeout(() => engine.clampPosition(), 0);
    if (t) showToast(`Your edits are kept. Press Detect to read ${bars === 2 ? 'two bars' : 'one bar'} from the track.`);
  }, [engine, applyDetection, showToast]);

  const loadFile = useCallback(async (file: File) => {
    engine.stop();
    setTrackStatus(`Decoding ${file.name}…`);
    let buffer: AudioBuffer;
    try { buffer = await engine.decode(await file.arrayBuffer()); }
    catch { setTrackStatus('Could not decode that file. Try an MP3, WAV, M4A or OGG.'); return; }
    const mono = new Float32Array(buffer.length);
    for (let c = 0; c < buffer.numberOfChannels; c++) {
      const d = buffer.getChannelData(c);
      for (let i = 0; i < d.length; i++) mono[i] += d[i] / buffer.numberOfChannels;
    }
    setTrackStatus('Listening for drums… 0%');
    let analysis: TrackAnalysis;
    try {
      analysis = await analyseAudio(mono, buffer.sampleRate, buffer.duration, runFeatures, (f) => setTrackStatus(`Listening for drums… ${Math.round(f * 100)}%`));
    } catch { setTrackStatus('Analysis failed in this browser.'); return; }
    const name = file.name.replace(/\.[^.]+$/, '');
    const base: TrackState = { name, buffer, analysis, barIndex: 0, hits: null, offGrid: 0, play: true, mode: 'loop' };
    setTrack(applyDetection(base, busiestBar(analysis)));
  }, [engine, applyDetection]);

  const setBarIndex = useCallback((idx: number) => {
    const t = trackRef.current;
    if (!t) return;
    engine.stop();
    updateTrack({ barIndex: Math.max(0, Math.min(t.analysis.bars.length - 1, idx)) });
  }, [engine, updateTrack]);

  const detectCurrentBar = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    engine.stop();
    setTrack(applyDetection(t, t.barIndex));
    showToast(`Grid replaced with what was heard in ${barLabel(t, t.barIndex, stateRef.current.bars)}`);
  }, [engine, applyDetection, showToast]);

  const retune = useCallback((bpm: number) => {
    const t = trackRef.current;
    if (!t || bpm < 40 || bpm > 220) return;
    engine.stop();
    const analysis = fitTempo(t.analysis, bpm, 0.003);
    const barIndex = Math.min(t.barIndex, analysis.bars.length - 1);
    setTrack(applyDetection({ ...t, analysis }, barIndex));
  }, [engine, applyDetection]);

  const shiftStart = useCallback((beats: number) => {
    const t = trackRef.current;
    if (!t) return;
    engine.stop();
    const analysis = shiftPhase(t.analysis, beats);
    setTrack({ ...t, analysis, barIndex: Math.min(t.barIndex, analysis.bars.length - 1) });
    showToast(`Bar start moved ${beats > 0 ? 'later' : 'earlier'} by one beat`);
  }, [engine, showToast]);

  const setTrackMode = useCallback((mode: TrackMode) => {
    engine.stop();
    updateTrack({ mode });
  }, [engine, updateTrack]);

  const trackHear: TrackHear = !track || !track.play ? 'drums' : Object.values(state.mute).every(Boolean) ? 'track' : 'both';

  const setTrackHear = useCallback((mode: TrackHear) => {
    const wantTrack = mode !== 'drums', muteAll = mode === 'track';
    setState((s) => ({ ...s, mute: { ...HEAR_SETS[muteAll ? 'none' : 'all'] } }));
    const t = trackRef.current;
    if (t && t.play !== wantTrack) {
      updateTrack({ play: wantTrack });
      if (!wantTrack) engine.stopTrackSources();
      else window.setTimeout(() => engine.restart(), 0);
    }
  }, [engine, updateTrack]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, select, textarea')) return;
      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
      if (e.code === 'Escape') stop();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [togglePlay, stop]);

  return {
    state, track, trackStatus, playing, nowStep, beat, toast, mine,
    play, pause, stop, togglePlay,
    setBpm, setSwing, setMetronome, toggleCell, toggleMute, setHear, setRes, setBars, clear,
    loadConfig, loadAndPlay, saveMine, loadSaved, loadSavedRhythm, copyAsJson,
    startMystery, answerMystery,
    loadFile, setBarIndex, detectCurrentBar, retune, shiftStart, setTrackMode, trackHear, setTrackHear,
    busiest: () => (track ? busiestBar(track.analysis) : 0),
  };
}

export type RhythmLab = ReturnType<typeof useRhythmLab>;
