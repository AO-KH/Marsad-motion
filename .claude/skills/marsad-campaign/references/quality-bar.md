# The quality bar for campaign films

A film is ready when every point below holds. Check it on the stills from `tools/stills.py` (each shot's start, action, result and hold), then on the draft in motion, then on the QA contact sheet and the mix report of the final build.

## Checklist

**Story**
- [ ] It follows the client's storyboard or brief. Anything added serves that story.
- [ ] Each shot has one job you can name: hook, problem, turn, proof, trust, the name, the end.
- [ ] It reads with the sound off: the lines alone carry it.
- [ ] The turn lands on the groove's first beat, and the end on the hit after the break.

**The main theme**
- [ ] Near-black stage with drifting dust. Each shot has its lens composition (or haze behind a busy UI shot).
- [ ] Type is `jt`: Inter 500 white, words blurring in, grey for the problem, gradient for Marsad, and the Arabic line under every English line.
- [ ] Real app parts are white with glowing rims. Chips are dark violet with a glowing edge.
- [ ] Only Marsad glows. The problem is dull and grey.
- [ ] The mark is big and has its own glow. Nothing round sits behind it: no orb, circle or disc.
- [ ] The end is the capsule: it blooms on the hit, then shows marsadnasl.com, the mark, "Book your demo · احجز عرضك التجريبي" and the footer, and holds for 2.5 s or more.
- [ ] No section labels ("THE PROBLEM", "HOW IT WORKS").

**Depth**
- [ ] No page lies flat and still. Pages stand, tilt or fly in perspective, and some real parts lift out of them.
- [ ] Lifted parts leave empty slots (blanked page bases), not ghosts.
- [ ] The camera or the parts move enough for the depth to read, and every label and page title stays in frame.

**Motion**
- [ ] Shots run 4–10 beats. Cuts fall on beats and are listed in `window.CUTS`.
- [ ] No shake, whip or spin, and nothing jumps on the beat. Punches are 1.5% or less, on the turn and the end only.
- [ ] Nothing throbs on every beat. Twinkles, drifts and running lights are off the beat.
- [ ] Every move eases. Peak speeds are checked, and the fast moves are rendered again with 16 samples.
- [ ] QA prints `RESULT PASS` (pulse ≤ 1.15, shake 0), and the contact sheet looks like the stills.

**Text**
- [ ] Every line is English plus a natural Arabic sentence, with Western digits in lines and overlays.
- [ ] Each line holds 3 s or more, and its Arabic 1.3 s or more once it has appeared.
- [ ] No line sits on content it hides. No text is cut by the frame, and none overlaps another.
- [ ] Product text on screen is the app's real text. Every rendering and invented element is listed for the delivery message.

**Sound**
- [ ] The client's funk track (or a track they approved) with a tested `edit`, and `true_peak` −3.
- [ ] Effects on the transitions only: whoosh and hit on the turn, whoosh and hit on the end, one or two quiet whooshes between. Three cues in 30 s, four in 48 s.
- [ ] QA's `audio` line: about −14 LUFS, and a true peak of −1 dBTP or lower, on the MP4.

**Delivery**
- [ ] Rendered with motion blur (`SUB=4`) plus the 16-sample ranges. The MP4 is under 30 MB.
- [ ] The message lists what was invented and what the client still has to settle.
- [ ] HANDOFF.md has the film's row, with its 16-sample frame ranges.

## Defects we have hit, and the fixes

| Symptom | Cause | Fix |
|---|---|---|
| The client asked "make this 3d" | App pages lay flat on a plate like a texture | Stand them up as glass slabs, lift real parts out, move the camera (`depth-and-3d.md`, level 3) |
| Every part floating out of a page has a ghost copy behind it | The part was lifted off a screenshot that still has it in place | Blank each part's slot (and its shadow) with the page's own colour, and keep the part flush over the slot until it lifts |
| A slab's label or a page is cut by the frame's side while the camera circles | Three flat-facing slabs side by side are wider than the frame at a close camera | Stand them in an arc (the side ones turned ±22° and slid in); start the circle wide and push in only as far as the side labels stay in frame |
| Names at the frame's foot are cut | A lower tier falls to the bottom of the frame as the camera lowers | Fade those names out under the pages and back in for the pull-back (keep the one the action starts from) |
| The client asked for "another shape" at the end | Two joined lenses (a figure-of-eight) behind "Book your demo." | One wide glowing capsule (CSS, its inset glows scaled while it shrinks), blooming on the hit |
| Whooshes on everything | One whoosh per cut and big move (14 in a film) | The transitions only: 3 in 30 s, 4 in 48 s ("reduce it dont put it at everything") |
| The pace felt slow, or too fast | 5–7 s shots, or about 2 s shots | Shots of 4–10 beats (2–5 s at 115 BPM), with more in each frame |
| A line over the opening's icons can't be read | Busy rings behind the type | Mask the rings out under the line (`mask-image: linear-gradient(to bottom, #000 55%, transparent 84%)`) |
| A line on the capsule disappears | The capsule is drawn after it | `zIndex = '2'` on the line |
| Labels and cards collide in a drawing | Type names, link names and cards all at plate level | Type names above the icons, link names at a fraction along the links, cards in the empty sky with a callout line |
| Giant white wedges sweep across a perspective drawing | Parts of a tier behind or above the camera projected with negative depth | Clip every polygon and line end to the part in front of the camera (`clipPj`, `NEAR`); show a tier above the camera by its underside and hide what stands on it |
| QA counts a "shake" in a spin of rings | Neighbouring rings turned in opposite directions, fast | Turn them all the same way, the inner ones faster |
| QA counts a "shake" while things glide into formation | Things crossed the screen, so quadrants moved in opposite directions | Scatter each thing near where it will land: a short tidy-up, no crossings |
| A glide or a flight jumps in steps even with motion blur | An `ioC` ease peaks at 3 × the average speed (a 1680 px move over 0.78 s: about 215 px a frame) | `ez.sin` (1.57 ×) and more time; check the peak px per frame before rendering |
| Sharp edges show as 3–4 ghost copies in a fast move | 4 blur samples no longer overlap at 30 px or more a frame | Render those frames again with 16 samples (`render_mb.js … 16 <from> <to>`, `blend.py`, `ONLY=audio`) |
| A caret, a label or a capsule measures 0 and lands at the left edge | It measured itself while its shot was hidden | Measure once shown, and don't cache a 0 |
| A number looks doubled (a ghost behind it) | Motion blur averaged sub-frames with different values | Step discrete values on `M.FQ(t)` |
| A real site-kit card loses its title, its buttons in the wrong place | The site kit's layout is scoped under `.site`, and the card was taken out of it | Wrap it in `<div class="site m-site">` |
| A horizontal SVG line vanishes, only its moving dot shows | A glow filter or gradient in bounding-box units: a horizontal line's box has zero height | `filterUnits`/`gradientUnits="userSpaceOnUse"` in stage px |
| The render stops with `page.screenshot: Timeout` | Blur or drop-shadow filters scaled 20× or more | Fade the filters out before the element grows, keep scales near 15×, hide what is transparent |
| Glass tiles flicker or double their glow while fading | Chromium's backdrop filter changes during fades | Keep the `.gk` base layer (`M.GLASS` adds it) |
| A glowing orb or ball sits behind the logo | A "carrier orb" taken literally | Remove it; the mark's own glow is the carrier ("remove the orb") |
| Things throb on every beat | Beat-locked loops (glow breathing, kicks, flashes) | Remove every per-beat loop; keep one-off hits and slow continuous motion |
| The MP4's true peak fails QA with the funk track | The bass-heavy track: AAC adds up to 1.5 dB to its peaks | `"true_peak": -3` in `film.json`'s `music`, then `ONLY=audio` |
| A track's licence is not what its collection says | Corpora re-host files with the wrong licence | Confirm on the track's own page; NC or ND is never usable. Record it in `fit/CREDITS.md` |
| Arabic-Indic digits next to Western ones | Copied from an older film's mock UI | Western digits in lines and overlays |
| A stale call to action | Copied from an older film | "Book your demo · احجز عرضك التجريبي" and marsadnasl.com |
| An empty stage for a beat after a hard cut | The shot's parts began their entrance after the cut | Start the first part's entrance on the cut itself (it can rise from depth or blur in), and the line within 0.4 s |
| A plate of the app's screen soft in the final (seen in 4K) | A small plate scaled up in 3D: Chrome rasters it at about its own size | Give the plate the size it shows (CSS width and height) and no scale-up; capture at 5× (`tools/app_shot.js`) |
| «تم بنجاح» was gone from the still of the success state | The app closes its success message after 2 s, and the 5× still came later | Hold that timer while the still is taken (patch `window.setTimeout` for 2000 ms in the state's `run`), then close the message with Escape (`films/style-jupiter/app/capture.js`) |
| The Decision Passport's masthead sat above the window | The app centres a modal taller than the window, so its top can't be reached | Capture that state in a taller window (`page.setViewportSize` in its `run`; `shots.json` gives the size under `sizes`) |
| A source chip under the assistant's answer read «بسمتى» | The chip cuts its title to one line with overflow hidden, which clips the dots under a final «ي» | Give sources titles without a final «ي», and tell the client (a front-end bug) |
| The assistant's answer vanished as soon as it arrived | A reply with a `conversationId` makes the page reload that conversation and replace the bubbles | Answer the chat without `conversationId` (or answer the conversation's GET with both messages) |
