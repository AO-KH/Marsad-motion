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
- [ ] The key action (the approve, the send, the generate) is clicked in a bar's silence and answered on its hit.
      Its proof floats out.
- [ ] The last step shows the outcome, and the benefit line says what the feature gives.

**Truth**
- [ ] The screens are the app's own, captured from its front end; each state's check read under 0.7% (sub-pixel
      text edges), or you looked at its diff and know why. The feature does only what the client described and
      the app itself does with the sample data.
- [ ] No call a screen needs was answered `{}` (the capture prints them as `NEW`).
- [ ] Everything invented, and every rendering, is listed in the delivery message. Say what came from the site
      kit's existing data.
- [ ] The feature catalogue allows it (`feature-catalogue.md`):
      - every feature shown is live;
      - no line uses its words to avoid;
      - the app is in dark mode;
      - the data carries the "Sample data · بيانات تجريبية" label;
      - no personal data or English Odoo name is in focus.

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
- [ ] Whooshes: four moments or fewer, all on transitions. Every click has its click sound (the client's
      `mouse-click.mp3`), one per bar at its +1.8, heard at least +6 dB over the music. No other UI sounds.
- [ ] QA prints `RESULT PASS`: pulse ≤ 1.15, shake 0, −14 LUFS ± 1.5, true peak ≤ −1 dBTP.
- [ ] The final is 1080p (1920×1080, the client's choice since 2026-10-01; 4K only when asked) with motion blur, and
      `tools/fast_ranges.py --run` was run on it, at the same scale (it prints "rendering at scale 1").

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
| An element or label the site kit lacks | The feature is only partly in the site kit | Capture the real screen from the client's front end (`tools/app_snap.js`). Only for a screen the front end lacks, rebuild it in `pages.js` with the fewest changes, and list what you invented |
| The whoosh-hits sounded off-key over a new track | The `cinematic-*-dsm` hits are tuned to the funk track (D# minor) | Estimate the new track's key, then re-tune the hits with rubberband (the `-am` pair is A minor, for the launch track). Name the key in `fit/CREDITS.md` |
| A click sound was buried (−11 dB under the music) | It fell on the track's pickup sound, 150 ms before the hit | Move the click into the bar's silence (the launch track: +1.5–2 beats), and let the result land on the hit. Check it: mix with and without the click cue (`tools/music_fit.py`), subtract, and compare the click's RMS with the music's over 120 ms |
| Opacity on a 3D group flattened it | Opacity, filters or `overflow` on a `preserve-3d` element flatten its children | The floating parts rise in their own 3D twin of the window (`wk-zl`), shown only while something floats; never fade a 3D group |
| QA flagged a shake on a long move | A `hop` dips the zoom mid-pan; with a big turn swing (ry +10 → −12) the motion reverses in every quadrant between two frames | Two moves instead: back out to context, then ease in (eased ends meet at rest, so nothing reverses at speed). No `hop` on real screens' short pans |
| The hand stopped beside the button it clicked | An `app.cursor` key later than the click's glide start (click − lead) overrode the glide | Bring the pointer in before the glide starts: `app.cursor(t)` with t < click − lead |
| Two clicks were buried (−6 and −22 dB under the music) | Clicks at a bar's +3.8: some bars are loud there (a lead-in to the downbeat) | One click per bar, at +1.8 in its silence; a flow with a dialog takes a bar per click. Measure each: mix with and without the click cue, subtract, compare over 120 ms |
| The client's click read only +5 dB | A short click normalised to its peak carries little energy at the old gain (−5) | Gain +1: +12 dB over the music in the silences |
| A captured screen lost its layout in the engine (tried before the fix) | The site kit's `.site *{position: relative}` reached the app's elements | The engine keeps them apart (`.site :where(:not(.rx-scope *))`, `.rx-scope{all: initial}`); `app.css` is scoped with `@scope (.rx-scope)` |
| A captured dialog filled nothing | `position: fixed` resolved against the transformed window (0×0) | The engine gives each captured page `contain: layout`, so it is the dialog's viewport, as the browser window was |
| Typing into a captured textarea showed nothing | A `<textarea>` can't hold the engine's typed spans | The tool turns fields into `div[data-rx-field]` sized and styled as they were, with the placeholder in `.ph` |
| The client: "the resolution is bad here" (a close-up's text looked soft) | 1080p frames: fine 14 px app text at z 3 is only a few pixels a stroke, and a player's rescale or a streamed copy blurs it further | Finals at 4K: `build_demo.sh` renders at `SCALE=2` (the DOM drawn at twice the pixels, not upscaled), in chunks so the sub-frames fit on disk, and fits the MP4 under 29 MB |
| The client, after the 4K final: "when it zoomed to page the resolution gets bad" (tilted close-ups soft at any resolution) | Chrome draws a layer under a perspective tilt at about its own pixel size (a rough scale, capped by the tile count, at least the device scale), and the camera's zoom was inside that 3D transform: the page was drawn at 1× and stretched 3× | The kit splits the camera: the tilt stays 3D on the window's layer, the zoom and pan are a flat transform painted inside it (`wk-zh`/`wk-zp`); floating copies are painted 4× larger in their 3D box and scaled back (`LSS`). Check a tilted close-up at 1:1 against a flat frame: the strokes should be as steep |
| The dialog's blurred backdrop came out sharp in some frames | A backdrop-filter in a 3D scene: its blur depended on the frames drawn before, so render jobs that started mid-dialog disagreed. Any part of a screen with its own layer (a sticky top bar, the veil and the dialog on it) was also drawn soft under the tilt | The engine flattens captured screens (`flatten`): sticky bars pinned where they stand; a backdrop blur behind a fill of 80% or more dropped; a full-screen veil given a blurred copy of the screen inside it (flat renders match the app's own blur but for 1 px edges). Check: no compositing layer inside `.wk-zh` (CDP `LayerTree`), and a frame reached directly matches the same frame reached by playing |
| A tight frame on a card's buttons was mostly empty card | RTL: the buttons sit at the card's far left, its text at the right | Frame the whole card, then ease in toward the buttons (z 2.35, ry −8) for the click |
| A floating node of the knowledge map rose at the wrong place and size | React Flow places its nodes and its viewport with CSS transforms, which `offsetLeft`/`offsetTop` don't see | The engine's element box (`boxIn`, and `tools/rects.js`) follows every transform; `lift` paints the copy at the part's own scale (the map's zoom) and keeps its glow the same width |
| `tools/rects.js` printed NaN for an icon button | The step-down from a wrapper to its only child walked into the button's SVG icon, which has no offset box | Step down only into HTML elements (the kit's `lift` does the same) |
| A part floated out of a dark-mode screen left a light grey hole | The recess and shadow were made for the light app | The kit uses darker ones (`.wk-slot.dk`, `.wk-shd.dk`) when the part sits in the app's `.dark` root |
| Arabic typed into a search box ran from the left | The box is `dir="auto"`: empty, it was left to right, and the snapshot froze that | From the first typed letter set the field's `direction: rtl` (`app.set`), as the browser does |
| The object page showed «تعذّر تحميل الإجراءات» | The action types call was answered `{}` | Answer list calls in the page shape the app reads (`{data: [], page: 0, size: 200, totalElements: 0, totalPages: 0}`); a call answered `{}` prints as `NEW` |
| A capture's tag found the wrong «فاتورة» | The same text sat in a hidden node of the other view | Scope the locator to the view on screen (`.react-flow__node-type`) |
| A file name turned into «pdf.0457» | An extension after Arabic text reorders in right-to-left text | Leave the extension out of Arabic record names |
| The map jumped when a double-click opened a record's links | Two captured states, before and after; the app eases its view onto the new records | Animate React Flow's viewport between the two states' transforms (about 0.45 s, as the app's fit view does), and fade the new records in over 0.15 s (listed as eased at delivery) |
| A 4K final was soft on every fast camera move (found 2026-10-01) | `tools/fast_ranges.py` re-rendered its 16-sample ranges without the final's scale, so at 1080p, and ffmpeg upscaled them into the 4K video: 328 of decisions-real v3's 1530 frames | It now renders at the final's scale (read from its frames) and stops if the frames differ in size; `build_demo.sh` checks the sizes before encoding. After a fast-range pass, check that every frame in `frames/<slug>-16x9/` is 3840 wide |
| QA flagged a shake on a fast dive whose camera never reverses | The first dive went from z 1 to 2.3 in 1.0 s, so 10% of zoom in one frame; QA's per-quadrant phase correlation can't follow that, and with 16 blur samples it misread the frame | Keep dives at 1.1–1.2 s, as §1 says (1.2 s fixed it). Before calling a flag a shake, read the camera's `ZP` transform per frame: a real shake reverses there |
