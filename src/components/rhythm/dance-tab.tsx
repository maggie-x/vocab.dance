import clsx from 'clsx';
import { useState } from 'react';
import { RhythmLab } from '../../hooks/use-rhythm-lab';
import { configFrom, EXERCISES, PRESETS } from '../../lib/rhythm/patterns';

const DanceTab = ({ lab }: { lab: RhythmLab }) => {
  const [answer, setAnswer] = useState<{ correct: boolean; text: string } | null>(null);

  const setUp = (e: typeof EXERCISES[number]) => {
    const cfg = configFrom(e.pattern);
    if (e.bpm) lab.setBpm(e.bpm);
    lab.loadAndPlay(cfg, { toast: false });
    lab.setHear(e.hear);
  };

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-xl font-black text-zinc-100">Dance to it</h2>
        <span className="text-xs text-zinc-400">Each exercise sets up the mix for you. Keep the bounce going the whole time.</span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3">
        {EXERCISES.map((e) => (
          <div key={e.key} className="grid min-w-0 content-start gap-2.5 rounded-xl border border-zinc-700 bg-zinc-800 p-4">
            <div className="text-[11px] uppercase tracking-[0.12em] text-zinc-400">Exercise {e.key}</div>
            <h3 className="text-base font-bold text-zinc-100">{e.title}</h3>
            <p className="text-xs text-zinc-300">{e.body}</p>
            <div className="mt-auto">
              <button type="button" onClick={() => setUp(e)} className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-900 hover:bg-white">
                Set up and play
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-3 rounded-xl border border-zinc-700 bg-zinc-800 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-base font-bold text-zinc-100">Name that groove</h3>
          <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-[11px] uppercase tracking-[0.08em] text-zinc-400">Listening challenge</span>
        </div>
        <p className="text-xs text-zinc-400">The grid hides its hits while a random library pattern plays. Pick the one you hear.</p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => { setAnswer(null); lab.startMystery(); }}
            className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-900 hover:bg-white"
          >
            Play a mystery pattern
          </button>
          {answer && <span className={clsx('text-sm font-semibold', answer.correct ? 'text-green-400' : 'text-red-400')}>{answer.text}</span>}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                const r = lab.answerMystery(p.id);
                if (!r) return;
                setAnswer({ correct: r.correct, text: r.correct ? `Yes. That was ${r.answer}.` : `Not quite. It was ${r.answer}.` });
              }}
              className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-100 hover:border-zinc-500"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DanceTab;
