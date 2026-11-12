import clsx from 'clsx';

export const Group = ({ label }: { label: string }) => (
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

export const GrooveCard = ({ name, meta, purpose, source, sourceUrl, active, onClick }: GrooveCardProps) => (
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
