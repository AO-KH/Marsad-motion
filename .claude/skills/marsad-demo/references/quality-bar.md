# The quality bar

A walkthrough is ready when every point below holds.
1. Check the stills from `tools/stills.py`: each step's dive, action and result, every float, the exit, the benefit
   and the end.
2. Check the draft's 3 fps contact sheet for the motion.
3. Check the final's QA sheet.

## Checklist

**The story**
- [ ] Each step's line matches what the camera shows while it is up. The action and its result are on screen and
      readable.
- [ ] The key action (the approve, the send, the generate) lands on the strong beat (k40 on the 44 s map). Its
      proof floats out.
- [ ] The last step shows the outcome, and the benefit line says what the feature gives.

**Truth**
- [ ] The pages and their text are the app's own. The feature does only what the client described.
- [ ] Everything invented, and every rendering, is listed in the delivery message. Say what came from the site
      kit's existing data.

**Framing**
- [ ] The subject's text reads at 30 px or more on screen.
- [ ] Nothing that matters is under the capsule (below y 900). The pointer lands below or beside a label, never on
      it.
- [ ] No line the viewer must read is cut by the frame.
- [ ] At a zoom-in, empty stage covers no more than about a quarter of the frame.
- [ ] No frame is mostly empty white: sparse subjects are zoomed, tilted or floated.

**The camera**
- [ ] Moves are continuous; the only cut is on the end hit.
- [ ] No hold stands dead: the push keeps it alive, and a step changes framing every 2–3 s.
- [ ] No pan at z ≥ 3 without a hop, because it strobes.
- [ ] Tilts stay at 14° or less, and are 0 while reading.
- [ ] 3D shows: the entrance, a tilt on the big moves, and one to three floats. There are no floats on every step.

**Text and timing**
- [ ] Every line is in English and Arabic, both natural, with Western digits.
- [ ] Each step line holds 3 s or more.
- [ ] The intro's name and the benefit line read in full before they go.
- [ ] State changes snap like the app's (`show` dur 0.45). Numbers and typed text step once per frame (the
      engine's `count`, `text` and `type` do).

**Sound and QA**
- [ ] Whooshes: four moments or fewer, all on transitions. Every click has its click sound, heard: at least +6 dB
      over the music at that moment. No other UI sounds.
- [ ] QA prints `RESULT PASS`: pulse ≤ 1.15, shake 0, −14 LUFS ± 1.5, true peak ≤ −1 dBTP.
- [ ] The final has motion blur, and `tools/fast_ranges.py --run` was run on it.

## Defects we have hit, and the fixes

| Symptom | Cause | Fix |
|---|---|---|
| A floating pill showed a square halo | `'text:'` found the pill's wrapper, which holds the same text | The kit's `lift` (and `tools/rects.js`) steps down to the single child with the same text. Do the same in any hand-made clone |
| The step number sat high in its chip | A `font` shorthand after `line-height` reset it to normal | Put the line height in the shorthand: `font:600 26px/56px 'Inter'` |
| A lone pill in a wide empty card left the frame mostly white | Framing a small thing in empty space | Zoom closer (z 3.9), turn the empty side away (`ry` 12), and float it out |
| The new card ghosted over the old one after a click | `app.show` at its 0.8 s default | `dur: 0.45`, like an app's own snap |
| NaN in the stage; the page stopped rendering | An option name (`benefit`, the line) clashed with a timing key | Timing overrides go in `times: {…}` |
| The pointer turned into a hand while still far off | The hand started 0.55 s before the click | The kit starts it 0.3 s before (`hand` in the click options changes it) |
| A reading shot looked static | A 2.6 s hold with a tiny drift | Dive close on the line (the whole title at z 3.5), then reveal its card (z 2.7, `sin`, 2.4 s) |
| A subject was centred but half the frame was sidebar and margin | The camera's centre was set on the subject's start, not its middle | Centre the middle (`tools/rects.js` prints it). Put a reading start near the right third |
| The clicked tab's name was hidden under the pointer | The click aimed at the element's centre | `{ax: 0.35, ay: 0.92}`: the fingertip lands under the label |
| Numbers looked doubled in motion blur | Sub-frames averaged two values | `app.count`, `app.text`, `app.type` step per frame; custom text uses `M.FQ(t)` |
| A fast zoom showed steps | Four sub-frames can't cover a big move | `python3 tools/fast_ranges.py <slug> --run`: 16 sub-frames on the fast ranges |
| A floating part looked flat | It rose straight at the camera | Tilt while it floats (rx 7, ry −10), so the gap and its shadow show |
| An element or label the site kit lacks | The feature is only partly in the site kit | Ask for the front end (HTML best, or 3× screenshots). Otherwise rebuild the page in `pages.js` with the fewest changes, and list what you invented |
| The whoosh-hits sounded off-key over a new track | The `cinematic-*-dsm` hits are tuned to the funk track (D# minor) | Estimate the new track's key, then re-tune the hits with rubberband (the `-am` pair is A minor, for the launch track). Name the key in `fit/CREDITS.md` |
| A click sound was buried (−11 dB under the music) | It fell on the track's pickup sound, 150 ms before the hit | Move the click into the bar's silence (the launch track: +1.5–2 beats), and let the result land on the hit. Check it: mix with and without the click cue (`tools/music_fit.py`), subtract, and compare the click's RMS with the music's over 120 ms |
| Opacity on a 3D group flattened it | Opacity, filters or `overflow` on a `preserve-3d` element flatten its children | The kit turns the window's `preserve-3d` on only while something floats, and never fades a 3D group |
