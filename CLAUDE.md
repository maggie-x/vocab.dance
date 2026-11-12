# vocab.dance

Dance Vocab Index: a searchable dictionary of dance moves, plus the Rhythm lab
(Kick & Snare Lab) at `/rhythm`. Create React App 5, TypeScript, Tailwind 3,
react-router 6, deployed to Netlify (`public/_redirects` sends every path to
`index.html`).

## Commands

```bash
npm start                                     # dev server on :3000
CI=true npx react-scripts test --watchAll=false   # run Jest once
npx tsc --noEmit -p tsconfig.json             # type-check everything
npm run build
```

Install with `npm`. Both `yarn.lock` and `package-lock.json` are committed;
`node_modules/.package-lock.json` shows npm did the last install. CRA warns
about Node 24 but builds fine.

## Conventions

- Tailwind utility classes inline. Hand-written CSS only where Tailwind cannot
  express it (currently `src/components/rhythm/rhythm.css`).
- Whole site is `font-mono` on `bg-zinc-900 text-white`. Panels are
  `bg-zinc-800 border-zinc-700`, muted text `text-zinc-400`, the site accent is
  pink. The Rhythm lab adds amber for kick and teal for snare because those
  colours carry meaning in the grid; its active states use the amber.
- Routes live in `src/index.tsx`. Anything that is not a style slug must be
  listed before `/:style`, or `App` redirects it home.
- Per-viewer preferences (view mode, last lab tab, saved patterns) go in
  localStorage through `useLocalStorage` from `react-use`.
- Move data is hand-written in `src/data/*.ts`. `FEEDBACK.md` is the running
  todo list for the move index.

## Rhythm lab

A drum grid for dancers: see where kick, snare and hats land, hear them apart,
load grooves, analyse your own track, and practise. Ported from a standalone
page, so the logic is framework-free and the React layer is thin.

### Module roles (`src/lib/rhythm`)

- `patterns.ts`: types, the groove library (presets, variants, concept demos,
  exercises), beat-string parsing (`"1,2&,3e"` to step indices), resolution
  remapping, bar resizing, labels. Pure.
- `timing.ts`: swing and microtiming maths. Swing delays the odd 16ths (the
  `e` and `a`) by up to half a step at 75%; triplets never swing. `hitShift`
  is the fraction of a step a hit sounds off its cell; the grid draws it.
- `synth.ts`: synthesised kick, snare, ghost, hat and click through a shared
  bus with soft saturation and a dark low-pass, meant to sound like a dusty
  sampler. No audio files anywhere.
- `engine.ts`: lookahead scheduler on the Web Audio clock. It reads the
  pattern through a `getState` callback every time it schedules a step, so
  edits during playback apply on the next pass. Emits `step`, `bar`, `end`
  and `state` events. Also owns track playback: loop one bar, or play through
  from the chosen bar with the grid looping alongside, bar events advancing
  the UI and `end` stopping at the track's end.
- `dsp.ts`: FFT and `bandFeatures`, the SuperFlux-style onset function per
  band (log-magnitude spectral flux against a frequency max-filtered earlier
  frame) plus per-band amplitude. Runs inside `analysis.worker.ts`.
- `analysis.ts`: everything after the spectrogram. Peak picking after librosa
  (local max, local-mean threshold, minimum gap, first of a cluster kept),
  with strength as the amplitude rise at the onset so sustained bass does not
  count. Onsets within 25 ms merge into events judged by spectral shape:
  kick needs a low rise that does not sustain and some attack above 150 Hz;
  snare needs crack that is still ringing 40 ms later with body under it and
  a non-dominant low band, quieter ones are ghosts; hats need a top-band
  rise measured against non-snare events. Tempo: autocorrelation with a
  log-Gaussian prior around 90 BPM, then a fine fit treating the 16th grid as
  a phase wheel. Downbeat: kicks on 1 and 3, snares on 2 and 4, kick 1
  strongest; when kick 1 and 3 are identical this is a coin toss, which is
  why the UI has beat-shift buttons. `detectBar` snaps one bar's hits to 16
  steps and averages timing per instrument into the grid's offsets.

### Saved rhythms (`src/data/rhythms.json`)

Rhythms taken from real songs, shown in the Grooves tab under "Saved". The
file is a JSON array; `src/lib/rhythm/saved.ts` converts entries to grid
configs and back. Every entry needs a `source` (the song) and a `bpm`. Hits are
beat strings, the same notation as the presets; a two-bar entry writes its
second bar as beats 5 to 8.

```json
{
  "name": "Short name",
  "source": "Artist – Song (bar 9)",
  "sourceUrl": "https://…",
  "bpm": 94,
  "res": "16",
  "bars": 1,
  "kick": "1,2&,3",
  "snare": "2,4",
  "hat": "1,1&,2,2&,3,3&,4,4&",
  "ghost": "2a",
  "swing": 58,
  "offsets": { "kick": 6, "snare": -12, "hat": -5 },
  "notes": "Kick sits late, snare early."
}
```

`res`, `bars`, `ghost`, `swing`, `offsets`, `notes` and `sourceUrl` are
optional. Offsets are milliseconds, negative is early; the ghost offset
follows the snare unless given.

Workflow for adding one: analyse the track on the Your track tab, fix the
grid by ear, press "Copy as JSON" above the grid, paste the entry into the
array and fill in `source`. Loading a saved rhythm also sets the tempo.

### React layer

- `src/hooks/use-rhythm-lab.ts` holds all state and creates the engine once.
  The engine reads state through refs, so anything the engine must see before
  the next render (track mode, bar index, hear mode) also writes the ref
  directly via `updateTrack`. Loading a pattern resets the paused position.
- `src/pages/rhythm.tsx` composes transport, grid, tab bar and the four tabs.
  `src/rhythm-app.tsx` is the page shell with the site menu.
- One component per section under `src/components/rhythm`. The grid's cell
  markers slide by `--shiftf` steps and a centre line appears when shifted;
  that is the only visualisation of microtiming, by design.

### Testing

Jest tests sit next to the modules in `src/lib/rhythm/*.test.ts` and cover
only pure logic: parsing, remapping, swing maths, FFT bin placement, onset
placement on a synthetic kick and hat, tempo and downbeat on synthetic onset
trains, bar detection, and event classification on synthetic band shapes.
There are no audio or DOM tests. When changing detection, generate a WAV with
known hits and offsets (a Node script writing 16-bit PCM is enough), drop it in
`public/`, load it on the Your track tab and compare the grid to what you
generated. Remove the WAV afterwards.

### Gotchas

- The analysis worker is created with
  `new Worker(new URL('./analysis.worker.ts', import.meta.url))`, which CRA's
  webpack 5 handles. Jest cannot parse `import.meta`, so tests must not import
  the hook or the worker; keep DSP in `dsp.ts` and test that.
- The low band wobbles after a kick when its tail beats against a bass note;
  that is why a kick requires attack energy above 150 Hz.
- A kick's click can out-rise a snare in the 150 to 800 Hz band, so never
  judge a snare by that band alone.
- Timing readouts are relative to a grid fitted to the onsets themselves, so a
  constant detection latency cancels; only differences between instruments
  are meaningful. Resolution is about 5 ms (hop 256 at 48 kHz).
- Sound only starts after a click, so the AudioContext is created lazily in
  `Engine.ensureAudio`.
