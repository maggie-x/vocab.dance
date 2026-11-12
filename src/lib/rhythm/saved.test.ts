import { configFrom } from './patterns';
import { configToSaved, rowsToStrings, savedToConfig, stepName } from './saved';

describe('stepName', () => {
  it('counts 16ths, 8ths and triplets, continuing into bar two', () => {
    expect([0, 1, 2, 3, 16, 31].map((i) => stepName(i, '16'))).toEqual(['1', '1e', '1&', '1a', '5', '8a']);
    expect([0, 1, 7].map((i) => stepName(i, '8'))).toEqual(['1', '1&', '4&']);
    expect([0, 1, 2].map((i) => stepName(i, '12'))).toEqual(['1', '1t', '1l']);
  });
});

describe('saved rhythms', () => {
  it('builds a config with tempo, source and timing from a JSON entry', () => {
    const cfg = savedToConfig({
      name: 'Example',
      source: 'Artist – Song',
      bpm: 94,
      kick: '1,2&,3',
      snare: '2,4',
      hat: '1,1&,2,2&,3,3&,4,4&',
      ghost: '2a',
      swing: 58,
      offsets: { kick: 6, snare: -12 },
      notes: 'Bar 4.',
    });
    expect(cfg.bpm).toBe(94);
    expect(cfg.purpose).toBe('From Artist – Song. Bar 4.');
    expect(cfg.rows.kick.map((v, i) => (v ? i : -1)).filter((i) => i >= 0)).toEqual([0, 6, 8]);
    expect(cfg.rows.ghost[7]).toBe(true);
    expect(cfg.swing).toBe(58);
    expect(cfg.offsets).toEqual({ kick: 6, snare: -12, hat: 0, ghost: -12 });
  });

  it('supports two-bar entries with beats 5 to 8', () => {
    const cfg = savedToConfig({ name: 'Two bars', source: 'x', bpm: 90, bars: 2, kick: '1,5&', snare: '2,4,6,8' });
    expect(cfg.rows.kick).toHaveLength(32);
    expect(cfg.rows.kick[18]).toBe(true);
    expect(cfg.rows.snare[28]).toBe(true);
  });

  it('round-trips the current grid to an entry and back', () => {
    const base = configFrom({ base: 'ghost', swing: 62, offsets: { kick: 15, snare: -20 } });
    const entry = configToSaved({ ...base, name: 'Ghost snare (edited)', bpm: 93 });
    expect(entry.name).toBe('Ghost snare');
    expect(entry.source).toBe('');
    expect(entry.kick).toBe('1,3');
    expect(entry.ghost).toBe('2&');
    expect(entry.swing).toBe(62);
    expect(entry.offsets).toEqual({ kick: 15, snare: -20 });
    const back = savedToConfig({ ...entry, source: 'Test' });
    expect(back.rows).toEqual(base.rows);
    expect(back.swing).toBe(62);
    expect(back.offsets.snare).toBe(-20);
  });

  it('carries per-hit nudges by count name in both directions', () => {
    const base = configFrom('boom');
    const nudges = { kick: new Array(16).fill(0), snare: new Array(16).fill(0), hat: new Array(16).fill(0), ghost: new Array(16).fill(0) };
    nudges.kick[8] = -35;
    nudges.hat[3] = 12;
    const entry = configToSaved({ ...base, nudges, bpm: 90 });
    expect(entry.nudges).toEqual({ kick: { '3': -35 } });
    const back = savedToConfig({ ...entry, source: 'x' });
    expect(back.nudges?.kick[8]).toBe(-35);
    expect(back.nudges?.hat[3]).toBe(0);
  });

  it('leaves defaults out of the exported entry', () => {
    const entry = configToSaved({ ...configFrom('boom'), bpm: 90 });
    expect(entry.swing).toBeUndefined();
    expect(entry.offsets).toBeUndefined();
    expect(entry.ghost).toBeUndefined();
    expect(rowsToStrings(configFrom('boom').rows, '16').hat).toBe('1,1&,2,2&,3,3&,4,4&');
  });
});
