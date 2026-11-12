import { RhythmLab } from '../../hooks/use-rhythm-lab';
import { CONCEPTS, configFrom } from '../../lib/rhythm/patterns';

const REFERENCES = [
  { label: "The Pharcyde, Runnin'", q: "The+Pharcyde+Runnin%27" },
  { label: 'Slum Village, Keep It On (This Beat)', q: 'Slum+Village+Keep+It+On+This+Beat' },
  { label: 'J Dilla, Donuts', q: 'J+Dilla+Donuts+full+album' },
];

const LearnTab = ({ lab }: { lab: RhythmLab }) => (
  <section className="grid gap-4">
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h2 className="text-xl font-black text-zinc-100">The Dilla feel, in six ideas</h2>
      <span className="text-xs text-zinc-400">Each card loads a demo into the grid and plays it.</span>
    </div>
    <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3">
      {CONCEPTS.map((c, i) => (
        <div key={c.title} className="grid min-w-0 content-start gap-2.5 rounded-xl border border-zinc-700 bg-zinc-800 p-4">
          <div className="text-[11px] uppercase tracking-[0.12em] text-zinc-400">Idea {i + 1} of 6</div>
          <h3 className="text-base font-bold text-zinc-100">{c.title}</h3>
          <p className="text-xs text-zinc-300">{c.body}</p>
          <div className="mt-auto">
            <button
              type="button"
              onClick={() => lab.loadAndPlay(configFrom(c.demo))}
              className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-900 hover:bg-white"
            >
              {c.label}
            </button>
          </div>
        </div>
      ))}
    </div>
    <div className="grid gap-3 rounded-xl border border-zinc-700 bg-zinc-800 p-4">
      <h3 className="text-base font-bold text-zinc-100">Listening references</h3>
      <p className="text-xs text-zinc-400">
        These are tracks to listen to for the feel. None of the patterns in this tool are claimed as transcriptions of them. If you add a real transcription later, note the source and the bar.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {REFERENCES.map((r) => (
          <a
            key={r.label}
            href={`https://www.youtube.com/results?search_query=${r.q}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-100 hover:border-zinc-500"
          >
            {r.label}
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default LearnTab;
