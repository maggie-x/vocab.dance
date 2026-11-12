import { RhythmLab, SavedPattern } from '../../hooks/use-rhythm-lab';
import { RES } from '../../lib/rhythm/patterns';
import { GrooveCard, Group } from './groove-card';

const savedMeta = (m: SavedPattern) => [`${m.bars} bar${m.bars === 2 ? 's' : ''}`, `${RES[m.res].labels.length * 4} steps`, ...(m.swing !== 50 ? [`swing ${m.swing}%`] : [])];

const GroovesTab = ({ lab }: { lab: RhythmLab }) => {
  const { state, mine, loadSaved } = lab;
  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-xl font-black text-zinc-100">Grooves</h2>
        <span className="text-xs text-zinc-400">Your own patterns. Edit the grid, press "Save to my patterns" above it, and they appear here.</span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2.5">
        <Group label="My patterns · saved in this browser" />
        {mine.length === 0 && (
          <p className="col-span-full text-xs text-zinc-400">
            Nothing saved yet. Start from a rhythm in the Rhythms tab or from your own track, change the grid, then save it to keep it here.
          </p>
        )}
        {mine.map((m, i) => (
          <GrooveCard key={`${m.name}-${i}`} name={m.name} meta={savedMeta(m)} purpose="Saved in this browser." active={state.name === m.name} onClick={() => loadSaved(m)} />
        ))}
      </div>
    </section>
  );
};

export default GroovesTab;
