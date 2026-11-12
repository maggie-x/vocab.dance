import clsx from 'clsx';
import rhythms from '../../data/rhythms.json';
import { RhythmLab, SavedPattern } from '../../hooks/use-rhythm-lab';
import { configFrom, describeConfig, PatternConfig, PRESETS, RES, VARIANTS } from '../../lib/rhythm/patterns';
import { SavedRhythm, savedToConfig } from '../../lib/rhythm/saved';

const LIBRARY: PatternConfig[] = [...PRESETS.map((p) => configFrom(p.id)), ...VARIANTS.map((v) => configFrom(v))];
const SAVED = rhythms as SavedRhythm[];

const GroovesTab = ({ lab }: { lab: RhythmLab }) => {
  const { state, mine, loadAndPlay, loadSaved, loadSavedRhythm } = lab;
  const savedMeta = (m: SavedPattern) => [`${m.bars} bar${m.bars === 2 ? 's' : ''}`, `${RES[m.res].labels.length * 4} steps`, ...(m.swing !== 50 ? [`swing ${m.swing}%`] : [])];
  const rhythmMeta = (r: SavedRhythm) => {
    const cfg = savedToConfig(r);
    const meta = cfg.res === '16' && cfg.bars === 1 ? describeConfig(cfg) : [`${cfg.bars} bar${cfg.bars === 2 ? 's' : ''}`, `${RES[cfg.res].labels.length * 4} steps`];
    return [`${r.bpm} BPM`, ...meta];
  };
  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-xl font-black text-zinc-100">Grooves</h2>
        <span className="text-xs text-zinc-400">Click one to load it into the grid and play it. Patterns you save appear here too.</span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2.5">
        <Group label="Library · illustrative, not transcriptions" />
        {LIBRARY.map((cfg) => (
          <GrooveCard key={cfg.name} name={cfg.name} meta={describeConfig(cfg)} purpose={cfg.purpose} active={state.name === cfg.name} onClick={() => loadAndPlay(cfg)} />
        ))}
        <Group label="Saved · taken from songs" />
        {SAVED.length === 0 && (
          <p className="col-span-full text-xs text-zinc-400">
            Nothing here yet. Analyse a track, fix the grid by ear, press "Copy as JSON" above the grid, and paste the entry into src/data/rhythms.json with the song as its source.
          </p>
        )}
        {SAVED.map((r) => (
          <GrooveCard
            key={`${r.name}-${r.source}`}
            name={r.name}
            meta={rhythmMeta(r)}
            purpose={r.notes ?? ''}
            source={r.source}
            sourceUrl={r.sourceUrl}
            active={state.name === r.name}
            onClick={() => loadSavedRhythm(r)}
          />
        ))}
        {mine.length > 0 && <Group label="My patterns · saved in this browser" />}
        {mine.map((m, i) => (
          <GrooveCard key={`${m.name}-${i}`} name={m.name} meta={savedMeta(m)} purpose="Saved in this browser." active={state.name === m.name} onClick={() => loadSaved(m)} />
        ))}
      </div>
    </section>
  );
};

const Group = ({ label }: { label: string }) => (
  <div className="col-span-full mt-1.5 text-[11px] uppercase tracking-[0.12em] text-zinc-400">{label}</div>
);

interface GrooveCardProps {
  name: string;
  meta: string[];
  purpose: string;
  source?: string;
  sourceUrl?: string;
  active: boolean;
  onClick: () => void;
}

const GrooveCard = ({ name, meta, purpose, source, sourceUrl, active, onClick }: GrooveCardProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={clsx(
      'grid min-w-0 content-start gap-1 rounded-xl border bg-zinc-800 px-3.5 py-3 text-left hover:border-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
      active ? 'border-amber-400 ring-1 ring-inset ring-amber-400' : 'border-zinc-700'
    )}
  >
    <strong className="text-sm text-zinc-100">{name}</strong>
    {source && (
      <div className="text-xs text-pink-300">
        from{' '}
        {sourceUrl ? (
          <a href={sourceUrl} target="_blank" rel="noreferrer" className="underline hover:text-pink-200" onClick={(e) => e.stopPropagation()}>
            {source}
          </a>
        ) : (
          source
        )}
      </div>
    )}
    <div className="break-words text-[11px] text-zinc-400">
      {meta.map((m, i) => (
        <span key={i}>
          {i > 0 && ' · '}
          {m.startsWith('K ') ? <><b className="text-amber-400">K</b>{m.slice(1)}</> : m.startsWith('S ') || m.startsWith('G ') ? <><b className="text-teal-400">{m[0]}</b>{m.slice(1)}</> : m}
        </span>
      ))}
    </div>
    <p className="text-xs text-zinc-400">{purpose}</p>
  </button>
);

export default GroovesTab;
