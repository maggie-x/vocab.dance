import rhythms from '../../data/rhythms.json';
import { RhythmLab } from '../../hooks/use-rhythm-lab';
import { configFrom, describeConfig, PatternConfig, PRESETS, RES, VARIANTS } from '../../lib/rhythm/patterns';
import { SavedRhythm, savedToConfig } from '../../lib/rhythm/saved';
import { GrooveCard, Group } from './groove-card';

const LIBRARY: PatternConfig[] = [...PRESETS.map((p) => configFrom(p.id)), ...VARIANTS.map((v) => configFrom(v))];
const FROM_SONGS = rhythms as SavedRhythm[];

const rhythmMeta = (r: SavedRhythm) => {
  const cfg = savedToConfig(r);
  const meta = cfg.res === '16' && cfg.bars === 1 ? describeConfig(cfg) : [`${cfg.bars} bar${cfg.bars === 2 ? 's' : ''}`, `${RES[cfg.res].labels.length * 4} steps`];
  return [`${r.bpm} BPM`, ...meta];
};

const RhythmsTab = ({ lab }: { lab: RhythmLab }) => {
  const { state, loadAndPlay, loadSavedRhythm } = lab;
  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-xl font-black text-zinc-100">Rhythms</h2>
        <span className="text-xs text-zinc-400">Preset rhythms. Click one to load it into the grid and play it.</span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2.5">
        <Group label="From songs · measured from a track" />
        {FROM_SONGS.length === 0 && (
          <p className="col-span-full text-xs text-zinc-400">
            Nothing here yet. Analyse a track, fix the grid by ear, press "Copy as JSON" above the grid, and paste the entry into src/data/rhythms.json with the song as its source.
          </p>
        )}
        {FROM_SONGS.map((r) => (
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
        <Group label="Generated · illustrative, not transcriptions" />
        {LIBRARY.map((cfg) => (
          <GrooveCard key={cfg.name} name={cfg.name} meta={describeConfig(cfg)} purpose={cfg.purpose} active={state.name === cfg.name} onClick={() => loadAndPlay(cfg)} />
        ))}
      </div>
    </section>
  );
};

export default RhythmsTab;
