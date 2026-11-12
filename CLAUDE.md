# vocab.dance

Dance Vocab Index: a searchable dictionary of dance moves, plus the Rhythm lab
(Kick & Snare Lab) at `/rhythm`. Create React App 5, TypeScript, Tailwind 3,
react-router 6, deployed to Netlify (`public/_redirects` sends every path to
`index.html`). The GitHub repo is public.

## Commands

```bash
npm start                                         # dev server on :3000
CI=true npx react-scripts test --watchAll=false   # run Jest once
npx tsc --noEmit -p tsconfig.json                 # type-check everything
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
- Never commit audio. The repo and the Netlify site are public, so a song in
  `public/` is a published copyrighted recording. Real tracks stay outside
  the repo; only the JSON entries they produce are committed. When a track is
  staged in `public/` for an in-app check, delete it before `git add -A`.

## Rhythm lab

A drum grid for dancers: see where kick, snare and hats land, hear them apart,
load grooves, analyse your own track, and practise. Ported from a standalone
page, so the logic is framework-free and the React layer is thin.

### Module roles (`src/lib/rhythm`)

- `patterns.ts`: types, the groove library (presets, variants, concept demos,
  exercises), beat-string parsing (`"1,2&,3e"` to step indices), resolution
  remapping, bar and nudge resizing, labels. Pure.
- `timing.ts`: swing and microtiming maths. `hitDelay` is the seconds a hit
  sounds after its cell: swing (odd steps only, up to half a step at 75%,
  never on triplets) plus the instrument offset plus the cell's nudge.
  `hitShift` is the same as a fraction of a step; the grid draws it.
- `synth.ts`: synthesised kick, snare, ghost, hat and click through a shared
  bus with soft saturation and a dark low-pass, meant to sound like a dusty
  sampler. No audio files anywhere. Offbeat hats play quieter.
- `engine.ts`: lookahead scheduler on the Web Audio clock. It reads the
  pattern through a `getState` callback every time it schedules a step, so
  edits during playback apply on the next pass. Emits `step`, `bar`, `end`
  and `state` events. Owns track playback too: loop mode plays the chosen
  track bar, and the next one in turn when the grid has two bars; play
  through runs the track from the chosen bar to the end with the grid looping
  alongside, bar events advancing the UI and `end` stopping it. The track's
  playback rate is grid tempo over fitted tempo, so bar lengths match exactly
  and tempo rounding cannot drift.
- `dsp.ts`: FFT and `bandFeatures`, the SuperFlux-style onset function per
  band (log-magnitude spectral flux against a frequency max-filtered frame two
  hops earlier) plus per-band amplitude, 2048-point window, hop 256. Runs
  inside `analysis.worker.ts`.
- `analysis.ts`: everything after the spectrogram; see Detection below.
- `saved.ts`: the `rhythms.json` entry format and its conversion to and from
  grid configs, including nudges keyed by count name.

### Detection, and why each rule exists

Every rule below came from measuring, first on generated loops whose hit
times are known exactly, then on a real trap-style track. Keep that order
when changing anything.

- **Bands.** Kick 35–140 Hz, snare body 150–800 Hz, snare crack 1–4 kHz, hats
  6–16 kHz. The snare detector runs on body plus half the crack flux.
- **Peak picking** follows librosa: local maximum over ±30 ms, above the
  ±100 ms local mean by a threshold, at least a minimum gap apart with the
  first of a cluster kept. Strength is the band amplitude's rise at the onset,
  not its level, so a sustained bass or pad under the drums does not count.
  Sustain is how much of that rise remains 150 ms later.
- **Start of file.** A track trimmed to begin on its first kick has no rise to
  detect. A band that opens at a clear level and has decayed by 150 ms gets an
  onset at time zero with the opening level as strength.
- **Events.** Onsets from the three detectors within 25 ms are one event,
  which keeps each band's own onset time and how much every band rose,
  normalised to the loudest rises in that band. Hats are normalised against
  non-snare events only, because snares are usually the brightest thing in the
  top band and would otherwise hide quiet hats.
- **Kick**: low rise at least 0.3 of the loudest, not sustaining like a bass
  note (under 0.85 at 150 ms), with some attack above 150 Hz. The attack test
  exists because the low band wobbles after a kick when its tail beats against
  a bass note and those wobbles have nothing above 150 Hz.
- **Snare**: crack still ringing 40 ms on but starting to fall (vocals and
  keys hold at full level), bright in the top band (vocals are dull), low band
  not dominant, and either body under a quiet crack or a loud crack without
  body. Trap snares and claps have almost no body; a kick's click can out-rise
  a snare in the body band, so that band alone can never decide. A body-less
  snare may only have tripped the top-band detector and is taken from there.
  Quieter snares are ghosts.
- **Hat**: top-band rise at least 0.25 and fallen by 40 ms. Vocal sibilance
  lands in the hat band and sustains; open hats lose out to this rule.
- **Tempo**: candidates are the local maxima of the autocorrelation of the
  kick-plus-snare onset train, weighted by a log-Gaussian prior around 90 BPM
  with half-period reinforcement, folded into exactly one octave, 67.5–135.
  Each candidate's 16th grid is then fitted to all onsets (phase wheel) and the
  candidate with the highest autocorrelation score times grid coherence wins.
  The fine fit finds the tempo to a hundredth of a BPM; the mean angle is the
  grid phase. Two lessons from a 127 BPM pop track that read as 83: a fold
  range wider than an octave holds a tempo and its half, so a kick-on-1,
  snare-on-3 pattern (period two beats) came out at 63.5 and was never
  doubled; and autocorrelation alone picked the one-and-a-half-beat repeat
  (84.6), whose grid left most hits between cells. Coherence rejects that
  outright (0.07 against 0.75 at the true tempo). Coherence on its own is
  biased towards faster tempos, so it only ranks candidates the
  autocorrelation already found.
- **Downbeat**: kicks favour beats 1 and 3, snares 2 and 4, kick 1 slightly
  stronger. Identical kicks on 1 and 3 make this a coin toss, hence the
  "Beat 1 is off?" buttons that shift the bar start by a beat.
- **Absolute timing.** Onset times must be right in absolute terms, not just
  consistent, because bar boundaries come from them and the track is played
  against the grid. The flux peaks when the attack is near the middle of the
  window, so a frame's time is `frame * hop + N/2`; the end-of-window formula
  ran about 15 ms late and made the synth drums lag the record. The low band
  fills in 10 to 15 ms after a kick's click, so a kick is timed where its
  low-band amplitude has risen a fifth of the way to its peak. Never borrow
  another band's onset time for a kick: a hat on the grid under a late kick
  sits in the same event and would erase the lateness. Resolution is about
  5 ms.
- **Grid placement** (`detectBar`): reads one or two consecutive bars onto
  the grid's current resolution (8ths, 16ths or triplets). Every hit goes to
  its nearest cell and keeps its true timing through the cell's nudge, so a
  hat on a triplet lands in the nearest 16th a third of a step off rather than
  being lost. Only a hit that loses its cell to a stronger one is dropped and
  counted. Offsets are the per-instrument average of on-beat and 8th hits;
  swing is read only from odd-step hats that run late, so triplet hats no
  longer inflate it. The default bar after analysis is the first bar with
  drums, not the busiest.
- **Known limit.** One grid per pattern. On the trap track the kicks live on
  16ths and the hats on triplets or sextuplets; the 16th grid now carries both
  through nudges, but a hit between two cells that both hold hits is dropped.

### Timing model

Three layers: swing (odd steps only), one offset per instrument, and a
per-cell nudge in milliseconds. Detection fills the nudges with each hit's
deviation from where swing plus offset would put it, so playback reproduces
the detected times exactly. Without nudges a straight kick on a swung grid
plays late by the swing amount, which is how the need was found. Toggling a
cell resets its nudge.

### Saved rhythms (`src/data/rhythms.json`)

Rhythms taken from real songs, shown in the Grooves tab under "Saved". The
file is a JSON array; `saved.ts` converts entries to grid configs and back.
Every entry needs a `source` (the song) and a `bpm`. Hits are beat strings, the
same notation as the presets; a two-bar entry writes its second bar as beats 5
to 8.

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
  "nudges": { "kick": { "3e": -40 } },
  "notes": "Kick sits late, snare early."
}
```

`res`, `bars`, `ghost`, `swing`, `offsets`, `nudges`, `notes` and `sourceUrl`
are optional. Offsets and nudges are milliseconds, negative is early; the ghost
offset follows the snare unless given. Workflow: analyse the track on the Your
track tab, fix the grid by ear, press "Copy as JSON" above the grid (it writes
only non-default fields and non-zero nudges), paste the entry into the array
and fill in `source`. Loading a saved rhythm also sets the tempo. Entries
detected before a detector change keep playing correctly because nudges
capture the measured times, but their swing and offsets may read oddly; re-run
detection when the file is handy.

### React layer

- `src/hooks/use-rhythm-lab.ts` holds all state and creates the engine once.
  The engine reads state through refs, so anything the engine must see before
  the next render (track mode, bar index, hear mode) also writes the ref
  directly via `updateTrack`. Loading a pattern resets the paused position.
  Loading a groove from any card (`loadAndPlay`) first calls `soloGrid`: all
  rows on, the track silent but still loaded. Otherwise a groove chosen while
  in "Track only" plays into muted rows and seems not to load.
- The bars and resolution switches re-detect at once while the grid holds an
  untouched detection (name still the detection name, no "(edited)"); once
  edited they keep the pattern and Detect does the re-read.
- `src/pages/rhythm.tsx` composes transport, grid, tab bar and the four tabs.
  `src/rhythm-app.tsx` is the page shell with the site menu.
- One component per section under `src/components/rhythm`. The grid's cell
  markers slide by `--shiftf` of the cell and a centre line appears when
  shifted; that is the only visualisation of microtiming, by design.
- Grid layout: columns are `max-content` for the row header and
  `minmax(0, 34px)` per cell, with a real spacer column between bars, and the
  grid justifies to the start. Cells shrink to fit so the whole pattern is
  always in view with no sideways scroll. An `auto` header track absorbed free
  space when wide and was handed less than its content when tight; margins on
  cells spilled into neighbours. Do not reintroduce either.

### Testing

Jest tests sit next to the modules in `src/lib/rhythm/*.test.ts` and cover
only pure logic: parsing, remapping, swing and nudge maths, FFT bin placement,
onset placement, start-of-file onsets, tempo and downbeat on synthetic onset
trains, bar detection at both resolutions, nudge round-trips, and event
classification on synthetic band shapes. There are no audio or DOM tests.

Two kinds of real check, in this order:

1. Offline harness. Decode a file with `ffmpeg -ac 1 -ar 48000 -f s16le`,
   compile the pure modules with `tsc --module commonjs --target es2019` into
   a scratch folder, and run them from a Node script over the PCM. For
   generated loops compare detector times with the exact times written into
   the WAV; for a real track print per-event band shapes, sustains, per-step
   histograms and detector-minus-waveform-onset statistics. Every detector
   rule in this file was found this way.
2. In the app. Stage the file in `public/`, start the dev server, open
   `/rhythm` in the browser pane, and feed the file to the upload input from a
   script (fetch, wrap in `File`, set `input.files`, dispatch `change`). Read
   results from the DOM. Remove the file before committing.

Generated loops: a Node script writing 16-bit PCM is enough. Use at least one
plain loop and one with bass and pad under swung drums, quieter offbeat hats, a
kick on 2& every other bar and an early snare.

### Gotchas

- The analysis worker is created with
  `new Worker(new URL('./analysis.worker.ts', import.meta.url))`, which CRA's
  webpack 5 handles. Jest cannot parse `import.meta`, so tests must not import
  the hook or the worker; keep DSP in `dsp.ts` and test that.
- Sound only starts after a click, so the AudioContext is created lazily in
  `Engine.ensureAudio`. The clipboard also needs a real user gesture; a
  scripted click shows the "Could not copy" toast and that is expected.
- A killed `react-scripts start` can leave a child on the port serving a
  stale bundle with a failing HMR socket; check `lsof -ti:<port>` and kill that
  PID, or use another port. After a code change, navigate with a fresh query
  string so the browser pane does not reuse a cached bundle.
- Hats on this kind of track also land at sextuplet positions. If that ever
  matters, the next step is a 6-per-beat grid, which changes the grid layout.
