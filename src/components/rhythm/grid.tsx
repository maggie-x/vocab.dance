import clsx from 'clsx';
import { CSSProperties, useState } from 'react';
import { RhythmLab } from '../../hooks/use-rhythm-lab';
import { fmtOff, Inst, INST_NAME, INSTS, RES, Res, stepsPerBar } from '../../lib/rhythm/patterns';
import { hitShift } from '../../lib/rhythm/timing';
import './rhythm.css';

const INST_TEXT: Record<Inst, string> = { kick: 'text-amber-400', snare: 'text-teal-400', hat: 'text-zinc-300', ghost: 'text-teal-400' };
const INST_CELL: Record<Inst, string> = {
  kick: 'bg-amber-400 border-transparent',
  snare: 'bg-teal-400 border-transparent',
  hat: 'bg-zinc-300 border-transparent',
  ghost: 'bg-teal-400/20 border-dashed border-teal-400',
};

const segButton = (active: boolean) =>
  clsx('px-3 py-1.5 text-xs', active ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100');

const Grid = ({ lab }: { lab: RhythmLab }) => {
  const { state, nowStep, toggleCell, toggleMute, setRes, setBars, clear, saveMine, copyAsJson } = lab;
  const [saveName, setSaveName] = useState('');
  const per = RES[state.res].steps, spb = stepsPerBar(state.res), total = spb * state.bars;
  // Columns shrink to fit the container, so the whole pattern is always in view, and never grow past 34px.
  const track = 'minmax(0, 34px)';
  const columns = state.bars === 2 ? `max-content repeat(${spb}, ${track}) 10px repeat(${spb}, ${track})` : `max-content repeat(${total}, ${track})`;
  const style = { gridTemplateColumns: columns } as CSSProperties;

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-xl font-black text-zinc-100">One bar, sixteen steps</h2>
        <span className="text-xs text-zinc-400">Click a cell to add or remove a hit. Use the switch next to each instrument to hear it or not.</span>
      </div>
      <div className="grid gap-3 rounded-xl border border-zinc-700 bg-zinc-800 p-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="inline-flex overflow-hidden rounded-lg border border-zinc-700" aria-label="Bars">
            {[1, 2].map((b) => (
              <button key={b} type="button" aria-pressed={state.bars === b} onClick={() => setBars(b)} className={clsx(segButton(state.bars === b), b === 2 && 'border-l border-zinc-700')}>
                {b} bar{b === 2 ? 's' : ''}
              </button>
            ))}
          </div>
          <div className="inline-flex overflow-hidden rounded-lg border border-zinc-700" aria-label="Subdivision">
            {(['8', '16', '12'] as Res[]).map((r, i) => (
              <button key={r} type="button" aria-pressed={state.res === r} onClick={() => setRes(r)} className={clsx(segButton(state.res === r), i > 0 && 'border-l border-zinc-700')}>
                {r === '8' ? '8ths' : r === '16' ? '16ths' : 'Triplets'}
              </button>
            ))}
          </div>
          <button type="button" onClick={clear} className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs hover:border-zinc-500">
            Clear
          </button>
          <button
            type="button"
            onClick={() => void copyAsJson()}
            title="Copy this pattern as an entry for src/data/rhythms.json"
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs hover:border-zinc-500"
          >
            Copy as JSON
          </button>
          <span className="flex-1" />
          <input
            type="text"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Name this pattern"
            aria-label="Name for saved pattern"
            className="w-44 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-amber-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => { if (saveName.trim()) { saveMine(saveName.trim()); setSaveName(''); } }}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs hover:border-zinc-500"
          >
            Save to my patterns
          </button>
        </div>
        <p className="text-xs text-zinc-400">{state.mystery ? 'Listen first. The hits are hidden until you answer.' : state.purpose}</p>
        <div className="pb-1">
          <div className={clsx('rl-grid grid w-full justify-start gap-[3px]', state.mystery && 'mystery')} style={style}>
            <div />
            {Array.from({ length: total }, (_, i) => {
              const sub = i % per, beatNo = Math.floor((i % spb) / per) + 1;
              return [
                <div
                  key={`l${i}`}
                  className={clsx(
                    'grid h-6 min-w-0 place-items-center overflow-hidden rounded-md text-[10px] tabular-nums sm:text-xs',
                    sub === 0 ? 'bg-white/5 text-sm font-bold text-zinc-100 sm:text-base' : 'text-zinc-500'
                  )}
                >
                  {sub === 0 ? beatNo : RES[state.res].labels[sub]}
                </div>,
                state.bars === 2 && i === spb - 1 ? <div key={`ls${i}`} /> : null,
              ];
            })}
            {INSTS.map((inst) => (
              <Row key={inst} inst={inst} lab={lab} total={total} per={per} spb={spb} nowStep={nowStep} toggleCell={toggleCell} toggleMute={toggleMute} />
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-400">
          <Legend swatch="bg-amber-400" label="Kick" />
          <Legend swatch="bg-teal-400" label="Snare" />
          <Legend swatch="bg-zinc-300" label="Hi-hat" />
          <Legend swatch="border border-dashed border-teal-400" label="Ghost snare (quiet)" />
          <Legend swatch="ring-2 ring-inset ring-white" label="Playing now" />
          <Legend swatch="bg-teal-400 relative after:absolute after:left-1/2 after:top-0.5 after:bottom-0.5 after:w-px after:bg-black/50" label="Mark off the centre line = early or late" />
        </div>
      </div>
    </section>
  );
};

interface RowProps {
  inst: Inst;
  lab: RhythmLab;
  total: number;
  per: number;
  spb: number;
  nowStep: number;
  toggleCell: (inst: Inst, step: number) => void;
  toggleMute: (inst: Inst) => void;
}

const Row = ({ inst, lab, total, per, spb, nowStep, toggleCell, toggleMute }: RowProps) => {
  const { state } = lab;
  const on = !state.mute[inst];
  const off = state.offsets[inst];
  return (
    <>
      <div className={clsx('flex items-center gap-1.5 pr-2 text-xs font-semibold sm:min-w-[112px] sm:gap-2', INST_TEXT[inst])}>
        <span className="hidden h-2.5 w-2.5 flex-none rounded-full bg-current sm:inline-block" />
        <span className="text-zinc-100">{INST_NAME[inst]}</span>
        <span className="ml-auto hidden whitespace-nowrap text-[11px] font-medium text-zinc-400 md:inline">{off ? fmtOff(off) : ''}</span>
        <button
          type="button"
          className="rl-switch ml-auto md:ml-1.5"
          aria-pressed={on}
          aria-label={`${INST_NAME[inst]} ${on ? 'on' : 'off'}`}
          title={`Hear ${INST_NAME[inst]}`}
          onClick={() => toggleMute(inst)}
        />
      </div>
      {Array.from({ length: total }, (_, i) => {
        const isOn = state.rows[inst][i];
        const shift = isOn ? hitShift(i, inst, state.swing, state.offsets, state.bpm, state.res, state.nudges[inst][i] ?? 0) : 0;
        return [
          <button
            key={i}
            type="button"
            aria-label={`${INST_NAME[inst]} step ${i + 1}${isOn ? ', on' : ', off'}`}
            onClick={() => toggleCell(inst, i)}
            style={{ '--shiftf': shift.toFixed(3) } as CSSProperties}
            className={clsx(
              'rl-cell rounded-md border p-0',
              inst,
              isOn ? clsx('on', INST_CELL[inst]) : 'border-zinc-700 bg-zinc-900',
              i % per === 0 && !isOn && 'bg-white/5 border-zinc-600',
              Math.abs(shift) > 0.01 && 'shifted',
              nowStep === i && 'ring-2 ring-inset ring-white'
            )}
          />,
          state.bars === 2 && i === spb - 1 ? <div key={`s${i}`} /> : null,
        ];
      })}
    </>
  );
};

const Legend = ({ swatch, label }: { swatch: string; label: string }) => (
  <span className="inline-flex items-center gap-1.5">
    <i className={clsx('inline-block h-3.5 w-3.5 rounded', swatch)} />
    {label}
  </span>
);

export default Grid;
