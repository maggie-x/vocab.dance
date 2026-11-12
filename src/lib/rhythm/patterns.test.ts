import { configFrom, describeConfig, hitsFrom, PRESETS, remapRows, resizeBars, stepLabel, STUDIES } from './patterns';

describe('hitsFrom', () => {
  it('parses beats and 16th subdivisions', () => {
    expect(hitsFrom('1, 2&, 3e, 4a', '16')).toEqual([0, 6, 9, 15]);
  });
  it('parses 8th offbeats and triplets', () => {
    expect(hitsFrom('1,2&', '8')).toEqual([0, 3]);
    expect(hitsFrom('1t,2l', '12')).toEqual([1, 5]);
  });
  it('treats empty input as no hits', () => {
    expect(hitsFrom('', '16')).toEqual([]);
    expect(hitsFrom(undefined, '16')).toEqual([]);
  });
});

describe('configFrom', () => {
  it('builds the preset rows with 8th-note hats by default', () => {
    const cfg = configFrom('boom');
    expect(cfg.rows.kick.map((v, i) => (v ? i : -1)).filter((i) => i >= 0)).toEqual([0, 8]);
    expect(cfg.rows.snare.map((v, i) => (v ? i : -1)).filter((i) => i >= 0)).toEqual([4, 12]);
    expect(cfg.rows.hat.filter(Boolean)).toHaveLength(8);
    expect(cfg.swing).toBe(50);
  });
  it('layers variant overrides on the base preset', () => {
    const cfg = configFrom({ base: 'ghost', name: 'Early', offsets: { snare: -20 } });
    expect(cfg.name).toBe('Early');
    expect(cfg.rows.ghost[6]).toBe(true);
    expect(cfg.offsets.snare).toBe(-20);
    expect(cfg.offsets.kick).toBe(0);
  });
  it('rejects unknown presets', () => {
    expect(() => configFrom('nope')).toThrow();
  });
});

describe('remapRows', () => {
  it('moves 16th hits to the nearest triplet and back', () => {
    const cfg = configFrom('offbeat');
    const trip = remapRows(cfg.rows, '16', '12', 1);
    expect(trip.kick).toHaveLength(12);
    expect(trip.kick[0]).toBe(true);
    expect(trip.kick[5]).toBe(true);
    const back = remapRows(trip, '12', '16', 1);
    expect(back.kick[0]).toBe(true);
    expect(back.kick[7]).toBe(true);
  });
  it('clamps a late 16th into the last 8th of its beat', () => {
    const rows = configFrom({ base: 'boom', kick: '1a' }).rows;
    const eighths = remapRows(rows, '16', '8', 1);
    expect(eighths.kick).toEqual([true, false, false, false, false, false, false, false].map((_, i) => i === 1));
  });
});

describe('resizeBars', () => {
  it('duplicates a bar and trims back', () => {
    const rows = configFrom('boom').rows;
    const two = resizeBars(rows, '16', 2);
    expect(two.kick).toHaveLength(32);
    expect(two.kick[16]).toBe(true);
    expect(resizeBars(two, '16', 1).kick).toEqual(rows.kick);
  });
});

describe('labels and descriptions', () => {
  it('names steps the way dancers count', () => {
    expect([0, 1, 2, 3, 4, 15].map(stepLabel)).toEqual(['1', '1e', '1&', '1a', '2', '4a']);
  });
  it('describes placements, swing and timing', () => {
    const cfg = configFrom({ base: 'boom', swing: 66, offsets: { kick: 22 } });
    expect(describeConfig(cfg)).toEqual(['K 1,3', 'S 2,4', 'swing 66%', 'kick 22 ms late']);
  });
});

describe('STUDIES', () => {
  it('have unique ids and names that do not clash with the presets', () => {
    const ids = [...PRESETS, ...STUDIES].map((p) => p.id);
    const names = [...PRESETS, ...STUDIES].map((p) => p.name);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(names).size).toBe(names.length);
  });

  it('all resolve to one bar of 16ths with every kick on the grid', () => {
    for (const study of STUDIES) {
      const cfg = configFrom(study.id);
      expect(cfg.bars).toBe(1);
      expect(cfg.res).toBe('16');
      const kicks = hitsFrom(study.kick, '16');
      expect(kicks.every((i) => i >= 0 && i < 16)).toBe(true);
      expect(kicks.filter((i) => cfg.rows.kick[i]).length).toBe(kicks.length);
    }
  });

  it('kick studies are named after their kick counts', () => {
    for (const study of STUDIES.filter((s) => s.id.startsWith('k-'))) {
      const described = describeConfig(configFrom(study.id))[0];
      expect(study.name).toBe(`Kick ${described.slice(2).split(',').join(' · ')}`);
    }
  });
});
