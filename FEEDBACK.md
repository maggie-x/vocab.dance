# Feedback and improvements

A running todo list for the site. Tick items off as they ship.

## From Jasey (Sep 2026)

Context: every dancer takes notes at some point; publishing them is fine as long as the site is honest about what it is. Names are the main thing to brace for, since they differ by region and change over time.

- [x] Disclaimer block at the bottom of the page: dictionary reference only, small part of a wider culture, not complete, not a sole resource, names vary.
- [ ] Show multiple names for a move. Add an optional `aliases` list to each move, display it under the name ("Also known as: ..."), and make search match aliases too.
- [ ] Optional description per move, shown only when there is creditable information about it. Add an optional `description` field to the move data and render it on the card when present.

Name examples to seed aliases with once confirmed:

| Move on site | Other names | Notes |
|---|---|---|
| Pepper Seed | World of Dance | Americans named it Pepper Seed after the Jamaican dance; Jamaicans call it World of Dance (per Link's video). |
| Spongebob | Party Machine | Stretch says it was the Party Machine in the 90s and became the Spongebob in 2009. |
| Crab Step | Pac Man | Crab Step is the Japanese name; the West Coast called it the Pac Man. |

## Codebase

- [ ] Pick one lockfile. Both `yarn.lock` and `package-lock.json` are committed.
- [ ] Remove the unused `react-ga4` dependency. Analytics is loaded via the script tag in `public/index.html`.
- [ ] Re-encode the S3 clips with `-movflags +faststart` and downscale to 480px so playback starts before the full file downloads.
- [ ] Set `Cache-Control: public, max-age=31536000, immutable` on the S3 objects.
- [ ] Consider moving off Create React App to Vite. CRA is unmaintained and the Netlify build warns about Node 16.
- [ ] Fuzzy search (for example `fuse.js`) so near-miss spellings still find a move.
