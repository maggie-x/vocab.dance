import clsx from 'clsx';
import { RhythmLab } from '../../hooks/use-rhythm-lab';

const Transport = ({ lab }: { lab: RhythmLab }) => {
  const { state, playing, beat, togglePlay, stop, setMetronome } = lab;
  return (
    <div className="sticky top-0 z-10 rounded-xl border border-zinc-700 bg-zinc-800 p-3 shadow-lg shadow-black/30">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="button"
          onClick={togglePlay}
          aria-pressed={playing}
          className={clsx(
            'min-w-[92px] rounded-lg px-4 py-2 text-sm font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
            playing ? 'bg-amber-400 text-zinc-900' : 'bg-zinc-100 text-zinc-900 hover:bg-white'
          )}
        >
          {playing ? 'Pause' : 'Play'}
        </button>
        <button
          type="button"
          onClick={stop}
          title="Stop and go back to beat 1"
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm hover:border-zinc-500"
        >
          Stop
        </button>
        <div className="flex gap-1.5" aria-label="Current beat">
          {[1, 2, 3, 4].map((b, i) => (
            <span
              key={b}
              className={clsx(
                'grid h-8 w-8 place-items-center rounded-md border text-sm font-bold tabular-nums',
                beat === i ? 'border-zinc-100 bg-zinc-100 text-zinc-900' : 'border-zinc-700 bg-zinc-900 text-zinc-500'
              )}
            >
              {b}
            </span>
          ))}
        </div>
        <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-zinc-400">
          <input type="checkbox" checked={state.metronome} onChange={(e) => setMetronome(e.target.checked)} className="h-4 w-4 accent-amber-400" />
          Metronome
        </label>
        <span className="text-xs text-zinc-400">
          {state.name} · <span className="tabular-nums text-zinc-100">{state.bpm} BPM</span>
        </span>
      </div>
    </div>
  );
};

export default Transport;
