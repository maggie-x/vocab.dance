import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { RhythmLab, TrackHear, TrackState } from '../../hooks/use-rhythm-lab';
import { Hit } from '../../lib/rhythm/analysis';
import { TrackMode } from '../../lib/rhythm/engine';
import { Inst, INST_NAME, stepLabel } from '../../lib/rhythm/patterns';

const COLOURS = { kick: '#fbbf24', snare: '#2dd4bf', hat: '#d4d4d8', fg: '#f4f4f5', muted: '#a1a1aa', line: '#3f3f46' };

const segBtn = (active: boolean) => clsx('px-3 py-1.5 text-xs', active ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100');
const btn = 'rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs hover:border-zinc-500';

const TrackTab = ({ lab }: { lab: RhythmLab }) => {
  const { track, trackStatus, loadFile, setBarIndex, detectCurrentBar, retune, shiftStart, setTrackMode, trackHear, setTrackHear, busiest } = lab;
  const [bpmText, setBpmText] = useState('');
  useEffect(() => { if (track) setBpmText(String(track.analysis.bpm)); }, [track?.analysis.bpm, track]);

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-xl font-black text-zinc-100">Analyse your own track</h2>
        <span className="max-w-2xl text-xs text-zinc-400">
          Load an MP3 or WAV. The page finds the tempo, picks a bar and guesses the kick, snare and hats from the sound. A starting point to fix by ear, not a transcription.
        </span>
      </div>
      <div className="grid gap-3.5 rounded-xl border border-zinc-700 bg-zinc-800 p-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <input
            type="file"
            accept="audio/*"
            aria-label="Audio file to analyse"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) void loadFile(f); }}
            className="max-w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-zinc-900 hover:file:bg-white"
          />
          <span className="text-xs text-zinc-400">{trackStatus}</span>
        </div>
        {track && (
          <>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <label className="flex items-center gap-2 text-xs text-zinc-400">
                Tempo
                <input
                  type="number"
                  min={40}
                  max={220}
                  step={0.01}
                  value={bpmText}
                  onChange={(e) => setBpmText(e.target.value)}
                  onBlur={() => retune(+bpmText)}
                  onKeyDown={(e) => { if (e.key === 'Enter') retune(+bpmText); }}
                  className="w-24 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-100 focus:border-amber-400 focus:outline-none"
                />
                BPM
                <button type="button" className={btn} title="Halve the tempo" onClick={() => retune(track.analysis.bpm / 2)}>½</button>
                <button type="button" className={btn} title="Double the tempo" onClick={() => retune(track.analysis.bpm * 2)}>×2</button>
              </label>
              <div className="flex items-center gap-2">
                <div className="inline-flex overflow-hidden rounded-lg border border-zinc-700">
                  <button type="button" aria-label="Previous bar" className={segBtn(false)} onClick={() => setBarIndex(track.barIndex - 1)}>‹</button>
                  <button type="button" aria-label="Next bar" className={clsx(segBtn(false), 'border-l border-zinc-700')} onClick={() => setBarIndex(track.barIndex + 1)}>›</button>
                </div>
                <span className="text-xs tabular-nums text-zinc-100">
                  Bar {track.barIndex + 1} of {track.analysis.bars.length} · starts {track.analysis.bars[track.barIndex].start.toFixed(2)} s
                </span>
                <button type="button" className={btn} onClick={() => setBarIndex(busiest())}>Busiest bar</button>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                Beat 1 is off?
                <div className="inline-flex overflow-hidden rounded-lg border border-zinc-700">
                  <button type="button" className={segBtn(false)} title="Move bar start one beat earlier" onClick={() => shiftStart(-1)}>−1 beat</button>
                  <button type="button" className={clsx(segBtn(false), 'border-l border-zinc-700')} title="Move bar start one beat later" onClick={() => shiftStart(1)}>+1 beat</button>
                </div>
              </div>
              <div className="inline-flex overflow-hidden rounded-lg border border-zinc-700" aria-label="Track playback mode">
                {(['loop', 'through'] as TrackMode[]).map((m, i) => (
                  <button key={m} type="button" aria-pressed={track.mode === m} className={clsx(segBtn(track.mode === m), i > 0 && 'border-l border-zinc-700')} onClick={() => setTrackMode(m)}>
                    {m === 'loop' ? 'Loop this bar' : 'Play through'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                Hear
                <div className="inline-flex overflow-hidden rounded-lg border border-zinc-700" aria-label="What to hear">
                  {([['track', 'Track only'], ['drums', 'Grid drums only'], ['both', 'Both']] as Array<[TrackHear, string]>).map(([m, label], i) => (
                    <button key={m} type="button" aria-pressed={trackHear === m} className={clsx(segBtn(trackHear === m), i > 0 && 'border-l border-zinc-700')} onClick={() => setTrackHear(m)}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <button type="button" className={btn} onClick={detectCurrentBar}>Detect this bar</button>
            </div>
            <p className="text-xs text-zinc-400">
              Play through runs the track from the chosen bar to the end while your grid pattern loops alongside it. Edit cells until the grid matches what you hear. Moving bars keeps your pattern; "Detect this bar" replaces it with a fresh guess. Use Hear to listen to the track alone, your grid drums alone, or both together.
            </p>
            <TrackCanvas track={track} onPick={setBarIndex} />
            {track.hits && <HitList hits={track.hits} />}
          </>
        )}
      </div>
    </section>
  );
};

const HitList = ({ hits }: { hits: Record<Inst, { step: number; dev: number }[]> }) => {
  const fmt = (d: number) => (d === 0 ? 'on' : `${d > 0 ? '+' : ''}${d} ms`);
  const colour: Record<Inst, string> = { kick: 'text-amber-400', snare: 'text-teal-400', ghost: 'text-teal-400', hat: 'text-zinc-300' };
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-4 gap-y-2 text-xs">
      {(['kick', 'snare', 'ghost', 'hat'] as Inst[]).filter((inst) => hits[inst].length).map((inst) => (
        <div key={inst} className="min-w-0">
          <strong className={colour[inst]}>{inst === 'ghost' ? 'Ghost (quieter snare)' : INST_NAME[inst]}</strong>{' '}
          <span className="text-zinc-400">{hits[inst].map((h) => `${stepLabel(h.step)} (${fmt(h.dev)})`).join(' · ')}</span>
        </div>
      ))}
      <div className="text-xs text-zinc-400">
        Numbers are how far each hit sounds from its grid step. Minus is early, plus is late. Resolution is a few milliseconds. The grid uses the average per instrument.
      </div>
    </div>
  );
};

/** Whole-track waveform with the chosen bar highlighted, and that bar zoomed with detected hits against the grid. */
const TrackCanvas = ({ track, onPick }: { track: TrackState; onPick: (idx: number) => void }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const draw = () => {
      const dpr = window.devicePixelRatio || 1, W = c.clientWidth, H = 210;
      if (!W) return;
      c.width = W * dpr; c.height = H * dpr;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.scale(dpr, dpr); ctx.clearRect(0, 0, W, H);
      const data = track.buffer.getChannelData(0), dur = track.buffer.duration;
      const ovH = 44, pad = 8;
      ctx.fillStyle = COLOURS.muted; ctx.globalAlpha = 0.5;
      const per = Math.max(1, Math.floor(data.length / W));
      for (let x = 0; x < W; x++) {
        let m = 0; const o = x * per;
        for (let j = 0; j < per; j += 8) { const v = Math.abs(data[o + j] || 0); if (v > m) m = v; }
        const hgt = Math.max(1, m * (ovH - 6));
        ctx.fillRect(x, pad + (ovH - hgt) / 2, 1, hgt);
      }
      ctx.globalAlpha = 1;
      const bar = track.analysis.bars[track.barIndex];
      ctx.fillStyle = COLOURS.kick; ctx.globalAlpha = 0.35;
      ctx.fillRect((bar.start / dur) * W, pad - 2, Math.max(2, ((bar.end - bar.start) / dur) * W), ovH + 4);
      ctx.globalAlpha = 1;
      ctx.font = '11px ui-monospace, Menlo, monospace'; ctx.fillStyle = COLOURS.muted; ctx.textAlign = 'left';
      ctx.fillText('Whole track · click to pick a bar', 6, pad + ovH + 14);
      const top = pad + ovH + 36, bottom = H - 8, x0 = 44, x1 = W - 10;
      const xAt = (t: number) => x0 + ((t - bar.start) / (bar.end - bar.start)) * (x1 - x0);
      const sr = track.buffer.sampleRate, s0 = Math.floor(bar.start * sr), s1 = Math.min(data.length, Math.floor(bar.end * sr));
      ctx.fillStyle = COLOURS.muted; ctx.globalAlpha = 0.25;
      const perZ = Math.max(1, Math.floor((s1 - s0) / (x1 - x0)));
      for (let x = x0; x < x1; x++) {
        let m = 0; const o = s0 + (x - x0) * perZ;
        for (let j = 0; j < perZ; j += 4) { const v = Math.abs(data[o + j] || 0); if (v > m) m = v; }
        const hgt = Math.max(1, m * (bottom - top));
        ctx.fillRect(x, top + (bottom - top - hgt) / 2, 1, hgt);
      }
      ctx.globalAlpha = 1;
      const stepLen = track.analysis.beatLen / 4;
      for (let i = 0; i <= 16; i++) {
        const x = xAt(bar.start + i * stepLen), isBeat = i % 4 === 0;
        ctx.strokeStyle = isBeat ? COLOURS.muted : COLOURS.line; ctx.lineWidth = isBeat ? 1.5 : 1;
        ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
        if (i < 16) {
          ctx.fillStyle = isBeat ? COLOURS.fg : COLOURS.muted;
          ctx.font = (isBeat ? 'bold 12px ' : '10px ') + 'ui-monospace, Menlo, monospace';
          ctx.textAlign = 'center';
          ctx.fillText(isBeat ? String(i / 4 + 1) : ['', 'e', '&', 'a'][i % 4], x, top - 4);
        }
      }
      const o = track.analysis.onsets;
      const lanes: Array<[keyof typeof COLOURS, string, Hit[]]> = [['kick', 'Kick', o.kick], ['snare', 'Snare', [...o.snare, ...o.ghost]], ['hat', 'Hi-hat', o.hat]];
      const laneH = (bottom - top) / 3;
      lanes.forEach(([key, label, onsets], li) => {
        const y1 = top + laneH * (li + 1) - 3, col = COLOURS[key];
        ctx.fillStyle = col; ctx.font = '600 11px ui-monospace, Menlo, monospace'; ctx.textAlign = 'left';
        ctx.fillText(label, 4, top + laneH * li + 13);
        const inBar = onsets.filter((h) => h.t >= bar.start - stepLen / 2 && h.t < bar.end);
        const max = Math.max(0.0001, ...inBar.map((h) => h.s));
        for (const h of inBar) {
          const hgt = 4 + (h.s / max) * (laneH - 10);
          ctx.globalAlpha = 0.35 + 0.65 * (h.s / max);
          ctx.fillRect(xAt(h.t) - 1.5, y1 - hgt, 3, hgt);
        }
        ctx.globalAlpha = 1;
      });
    };
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [track]);

  return (
    <canvas
      ref={ref}
      height={210}
      aria-label="Waveform with the chosen bar and the detected drum hits against the grid"
      className="block h-[210px] w-full cursor-pointer rounded-lg border border-zinc-700 bg-zinc-900"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        if (e.clientY - r.top > 60) return;
        const t = ((e.clientX - r.left) / r.width) * track.buffer.duration;
        const idx = track.analysis.bars.findIndex((b) => t >= b.start && t < b.end);
        if (idx >= 0) onPick(idx);
      }}
    />
  );
};

export default TrackTab;
