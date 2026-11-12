import clsx from 'clsx';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorage, useTitle } from 'react-use';
import DanceTab from '../components/rhythm/dance-tab';
import Grid from '../components/rhythm/grid';
import GroovesTab from '../components/rhythm/grooves-tab';
import LearnTab from '../components/rhythm/learn-tab';
import RhythmsTab from '../components/rhythm/rhythms-tab';
import TrackTab from '../components/rhythm/track-tab';
import Transport from '../components/rhythm/transport';
import { useRhythmLab } from '../hooks/use-rhythm-lab';

type Tab = 'rhythms' | 'grooves' | 'analyse' | 'learn' | 'practice';
const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'rhythms', label: 'Rhythms' },
  { id: 'grooves', label: 'Grooves' },
  { id: 'analyse', label: 'Your track' },
  { id: 'learn', label: 'Dilla feel' },
  { id: 'practice', label: 'Dance' },
];

const RhythmPage = () => {
  const lab = useRhythmLab();
  const [tab = 'rhythms', setTab] = useLocalStorage<Tab>('rhythm.tab', 'rhythms');
  useTitle('Kick & Snare Lab | Dance Vocab Index');

  useEffect(() => {
    const fromHash = window.location.hash.slice(1) as Tab;
    if (TABS.some((t) => t.id === fromHash)) setTab(fromHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (id: Tab) => {
    setTab(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-7 pt-16">
      <header className="grid gap-1">
        <Link to="/" className="text-[11px] uppercase tracking-[0.12em] text-zinc-400 hover:text-pink-400">
          ← Dance Vocab Index · Rhythm practice for dancers
        </Link>
        <h1 className="text-3xl font-black text-zinc-100 sm:text-4xl">Kick &amp; Snare Lab</h1>
        <p className="max-w-2xl text-sm text-zinc-400">
          See where the kick and snare land, hear them apart, then move to them. Patterns are illustrative practice grooves, not transcriptions of any record.
        </p>
      </header>

      <Transport lab={lab} />
      <Grid lab={lab} />

      <div className="grid gap-5">
        <div role="tablist" aria-label="Sections" className="flex flex-wrap gap-1 border-b border-zinc-700">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => pick(t.id)}
              className={clsx(
                '-mb-px border-b-2 px-3.5 py-2.5 text-sm font-bold',
                tab === t.id ? 'border-amber-400 text-zinc-100' : 'border-transparent text-zinc-400 hover:text-zinc-100'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div role="tabpanel" hidden={tab !== 'rhythms'}><RhythmsTab lab={lab} /></div>
        <div role="tabpanel" hidden={tab !== 'grooves'}><GroovesTab lab={lab} /></div>
        <div role="tabpanel" hidden={tab !== 'analyse'}><TrackTab lab={lab} /></div>
        <div role="tabpanel" hidden={tab !== 'learn'}><LearnTab lab={lab} /></div>
        <div role="tabpanel" hidden={tab !== 'practice'}><DanceTab lab={lab} /></div>
      </div>

      <footer className="grid gap-1.5 text-xs text-zinc-400">
        <div>Grid patterns are illustrative practice grooves. Nothing here is a verified transcription of a J Dilla recording.</div>
        <div>Keyboard: space plays and pauses, Escape stops.</div>
      </footer>

      <div
        role="status"
        className={clsx(
          'pointer-events-none fixed bottom-5 left-1/2 z-20 max-w-[calc(100vw-32px)] -translate-x-1/2 rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-opacity',
          lab.toast ? 'opacity-100' : 'opacity-0'
        )}
      >
        {lab.toast}
      </div>
    </div>
  );
};

export default RhythmPage;
