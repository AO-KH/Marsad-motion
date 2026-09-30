# The walkthrough method, in detail

1. Where it comes from
2. What is on screen
3. The camera
4. Framing
5. Actions, states and floating parts
6. The lines
7. The two music maps, with their effects
8. The reference, beat by beat

## 1. Where it comes from

The client's request (September 2026): "i want to change the walkthrough method, take these video for the walk
through and take them as reference https://x.com/benjitaylor/status/2072435629548597547 ,
https://notes.apoorv.xyz/launch-videos keep the marsad and NASL theme, the idea for the walkthrough videos is i will
give you feature of my saas and you make a walkthrough to explain the feature".

**Benji Taylor's "Live Studio" walkthrough** (52 s, 1080×1080, 60 fps), shot by shot:

| Time | What happens |
|---|---|
| 0–2.5 s | "Introducing" alone in small white type on black, then "Live Studio" under it |
| 1.5–4 s | A laptop rises from below; its screen becomes a floating browser window of the real UI |
| 4–45 s | A virtual camera dives 3–4× onto each thing that's used (a sidebar item, a menu row, a button, a date in a calendar, a radio button, the chat). The pointer, a hand over buttons, clicks. The camera pulls back for context. |
| 45–47 s | The window shrinks away |
| 47–52 s | "Now Live in Creator Studio" on black |

- **The steps (4–45 s):**
  - There is a new action every 1.5–3 s.
  - The UI's own state changes carry the story: typing, a modal's steps, a countdown, a live chat.
  - The moves are continuous, with the rare cut.
  - There are no captions during the steps.
- **The launch videos** at notes.apoorv.xyz/launch-videos (21 studied) share a look:
  - big type, one idea at a time;
  - UI parts blown up in 3D with glowing edges;
  - a single click, and zoom-throughs;
  - a dark stage, ending on a logo and a URL.

**What we kept:**
- the window rising in;
- the diving camera;
- the real clicks and state changes;
- the pace of moves;
- type on the stage for the intro and the outro.

**What Marsad's theme changes:**
- **The stage** is the main theme's near-black (the 48 s film, `films/style-jupiter`), without its lenses: only soft
  glows, at the client's request (§2).
- **The type** is the theme's `jt`: words blur in, a gradient on the key word, the Arabic under it.
- **The window** gets the theme's glowing rim.
- **The app's parts** float out in 3D.
- **The end** is the capsule end, and the music is the client's: their launch track (§7).

**What we added** is one step line at a time, in a capsule. The client wants each feature explained, and every
line in English and Arabic. Benji needs no words; a feature explainer does.

## 2. What is on screen

- **Stage** (`#06050E`): near black, with soft violet glows and nothing else. The app is the only thing on it,
  as in Benji's.
  - The glows are never circles: two in the sky, a horizon under the window during the steps, a glow behind the
    benefit line, and a haze under the capsule at the end. They drift 2% with the camera.
  - The client took out the first sample's lens circles ("change the bubbles … replace it with stars"), then the
    stars ("remove the stars"). No lenses, stars or dust in walkthroughs; the campaign films keep their lenses.
- **Window:** the engine's `M.app` window, 1360×760 at stage (280, 150). It shows a real screen (captured at
  1440×805) at 0.944, or a site-kit page (1896×1060) at 0.717. Its rim is the theme's (`demos/kit/walk.css`); the
  light UI's turning beam and click ripple are off.
- **Pointer:**
  - It is the app's arrow, which becomes a hand from 0.3 s before a click until 0.85 s after (`app.click` adds it).
  - It keeps about one size on screen: it scales by z^−0.5 as the camera zooms.
- **Capsule:** 84 px tall at y 946, centred. It holds the step number in a violet chip, then the English line
  (Inter 500, 31 px) · the Arabic line (IBM Plex Sans Arabic 500, 29 px). It widens and narrows between steps while
  the lines blur across.
- **Type:**
  - the intro kicker: grey, 46 px, at y 350;
  - the name: gradient, 132 px, with its Arabic at 46 px;
  - the benefit: 84 px at y 430, with a gradient last word and the Arabic at 44 px;
  - the end: the capsule end, as in `films/pulse-30`.

## 3. The camera

`cam(t, to, o)` glides from wherever the camera is at t. A zoom turns about the point that stays put on screen, so a
dive reads as going into the thing, not as a slide.

**`to`: where it goes.**
- `at`: a page point `NP(x, y)` (natural px), a selector, `'text:…'`, or `{page, sel}`.
- `dx`, `dy`: a nudge in natural px.
- `'page'`: the whole window, slightly tilted.
- `z`: the zoom.
- `rx`, `ry`: tilts in degrees. Positive `ry` turns the right side away.
- `ox`, `oy`: a screen offset.

**Zoom levels in use** (real screens, 1440 wide; site-kit pages need about 1.3× these):

| z | Shows | Use |
|---|---|---|
| 0.62 | the window, small and tilted | the exit (the kit's) |
| 1.0–1.04 | the whole page | context; after a page opens |
| 1.45–1.75 | a whole card (1120 natural px) | a result that fills a card; a floating card; the context before a click |
| 2.0–2.4 | a group: the top bar and the welcome, two stat cards, a dialog | reading a group; a dialog; numbers changing |
| 2.75–3.6 | a line of text, a pill row, a button column | the thing itself |

**Tilts:**
- 0 while reading;
- 3–5° on whole-page holds;
- 7–10° while a part floats out, so its lift shows;
- up to 12° to turn an empty side away;
- 14/−18° on the exit.

**`o`: how it moves.**
- `dur`: dives 1.1–1.2 s, pull-backs 1.3–1.6 s, long pans 1.4–1.5 s.
- `ease`: `prem` for moves (the default); `sin` for a slow reveal.
- `hop`: 0.35–0.45 on a pan longer than about 600 natural px at z ≥ 3. The zoom dips mid-move, so the pan doesn't
  strobe.
- `push`: 0.012 per second by default. After arriving, the camera keeps creeping in. Use 0 only for a held
  composition.

**The kit's own moves:**
- the entrance: the window rises on its back from k4.5 (rx 64 → 40 → 0) and lands flat at k8;
- the exit: from `K.exit`;
- the end: a cut on the hit, which is the only cut.

## 4. Framing

- **Measure, then choose.** `node tools/rects.js <slug> <targets…>` prints each target's natural rect, its centre
  (for `NP`), and the z at which it fills 80% of the width.
- **Text size.** The real app's body text is 14 px and its card titles 16 px: at z 2.3 that's 30 and 35 px on
  screen, at z 3 40 and 45 px. Site-kit body text is 16–21 natural px (at z 3, 34–45 px). Aim for 30 px or more on
  the subject.
- **Keep the capsule clear.** It covers y 946–1030. Centre the subject at or above the middle, so nothing that
  matters goes below y 900.
- **Whole lines.** A 627 natural px title fits whole at z 3.5 (1575 px on screen). Cutting a line the viewer must
  read looks like a mistake; cutting context at the frame's edge is fine.
- **Window edges.** At high zoom near a page edge, the window's rim and the stage show. That is good for a moment,
  because it shows the window as an object. Keep it under about a quarter of the frame.
- **Sparse subjects.** A lone pill in a wide empty card leaves the frame mostly white. Zoom closer (z about 4),
  turn the empty side away (ry 12), and float the pill out. Or frame it with its neighbours.
- **RTL.** The app reads from the right, so reading moves go right to left, and a title's start is its right end.
  A card's buttons sit at its far left, with its text at the right: a tight frame on the buttons is mostly empty
  card. Frame the whole card as the step starts (z 1.75), then ease in toward the buttons (z 2.35) for the click.

## 5. Actions, states and floating parts

- **Clicks:** `app.click(t, target, {ax, ay, lead, dur})`.
  - Aim at the lower part of the label (`ay` 0.7–0.92), so the hand never covers it.
  - The glide takes `lead` 0.8–1.1 s and `dur` 0.7–0.9 s. The camera arrives before the hand presses.
  - Bring the pointer in first with `app.cursor(t, NP(x, y), {dur: 0.15–0.2})`, from inside the frame's lower
    right, **before** the click's glide starts (t < click − lead): a later cursor key wins, and the hand ends up
    beside the button.
  - The app's own hover and press: the `hover(a, b, target)` and `press(t, target)` helpers in
    `demos/decisions-real/demo.js` set `.rx-hover` (the app's `:hover` rules) while the hand is on it, and dip the
    button by 5% under the click.
  - **Every click is heard** (the client: "add sfx for the click"), with the client's mouse click ("use this click
    sound"): `{"file": "fit/sfx/mouse-click.mp3", "beats": [9.8, 29.8, 33.8, 37.8], "gain": 1}` in the reference.
    One cue lists every click.
  - **One click per bar, in its silence.** On the launch track each groove bar is quiet from +1.25 to +2.25 beats
    (−34 to −45 dB) and hits at +2.5. Click at +1.8; the result lands on +2.5. The rest of a bar is not reliably
    quiet: at +3.8 before some downbeats the music is at −12 dB, and a click there was buried at −22 dB. Check each
    click at +6 dB or more (`quality-bar.md`); at gain +1 the reference's read +12 dB.
  - **The result lands on the hit that follows.** The page change, the dialog, the message or the typing comes on
    the +2.5 hit, 0.5 s after the click.
- **Page changes and the app's states:** each is a captured state, swapped with `app.page(hit, key, {dur})`: 0.35 s
  for a new page, 0.2 s for a dialog or a message (the app shows them at once), 0.1 s for a field taking the focus
  (at the click itself). Pull back to the whole page about 1.1 s after a new page; it is the result. Keep the app's
  own timings: its «تم بنجاح» stays 2 s, then its refreshed page.
- **State changes:**
  - `app.show(t, sel, {from:'none', scale:0.97, dur:0.45})`: a card appears. At 0.45 s it snaps like the app;
    0.8 s ghosts.
  - `app.count` and `app.text`: numbers and labels.
  - `app.type`: typing, at 14–18 characters a second. On a real screen, type into the captured field of the
    state where it has the focus (`div[data-rx-field]`: its placeholder hides, the caret shows).
  - `app.toggle`, and `app.set` for anything else, such as a button's press.
- **Floating parts:** `lift(spec, a, b, {glow, depth, up, down, hide, display, exact})`. `exact: true` lifts a whole
  card (without it, `lift` steps down into a wrapper's only child).
  - The part rises off the page over the recess it leaves, with its shadow falling on the page, then settles back
    by b and hands over to the real one.
  - `depth`: 30 for a pill, 60 for a card.
  - `glow`: `green` for success or confidence, `violet` otherwise.
  - `hide`: anything under it that must not show through, such as a card hidden by a success message.
  - Use it on the one or two things that prove the feature: the result, the confidence, the data source. Not on
    every step.
  - Pair it with a tilt (rx 7, ry −10 on a card), so the lift reads as depth, not as a zoom.

## 6. The lines

**The intro** runs k0–7:
- `kicker` "Introducing" (grey);
- `name`, the feature's name with a full stop (gradient);
- `ar`, «تعرّف على …», which is its own Arabic, not a word-for-word copy.

For an existing feature, "Introducing" still presents it; don't write "new" unless it is.

**The steps.** One line per step, held for the whole step:
- English starts with a verb and has at most about 6 words: "Open Decisions", "Read the recommendation", "Check its
  confidence and source", "Approve it", "It's recorded right away".
- Arabic uses the imperative: «افتح صفحة القرارات»، «اقرأ التوصية»، «راجع درجة الثقة والمصدر»، «اعتمد التوصية»،
  «يُسجَّل القرار فوراً».

**The benefit** is one sentence of what the feature gives, held through the track's break: "From recommendation to
action." / «من التوصية إلى التنفيذ.». Put the gradient on the last word.

## 7. The music maps, with their effects

**The walkthroughs' track (the default):** the client's launch track (`fit/monume-product-launch-review.mp3`: Monume,
"Product Launch Review", Pixabay, the client's choice: "use this music"). `map:'launch'`, `"duration": 51.0`.
- **Tempo:** 80 BPM (a half-time 160 feel), downbeat 0.012, A minor. `B(k)` = k × 0.75 s.
- **Its sections** (bars of 3 s):
  - song bar 0 (0–3 s): drums only;
  - bars 1–19: the groove, from a big hit at 3.0 s;
  - bars 20–23 (60–72 s): a quiet breakdown without drums;
  - bar 24 (72 s): the groove comes back with a big hit;
  - bars 40–43: the outro.
- **Each groove bar:** it hits on its downbeat (+0), falls silent at +1.5–2, and hits again at +2.5, so a click on a
  +2.5 or a downbeat lands right after a silence. The weaker +0.5 and +3.5 hits come about 60 ms early.
- **The edit:** `[[0,4],[0,48],[88,104]]`. That's the drum bar twice (a 6 s intro), then the groove (bars 0–11),
  then the last two bars of the breakdown and the returning hit.

| Film beats | Music | The walkthrough |
|---|---|---|
| k0–8 | the drum bar, twice | the intro; the window rises from k4.5 |
| k8 | the groove's big hit | the window lands; whoosh + hit |
| k8–48 | the groove | steps: dives on downbeats and +2.5s; clicks at a bar's +1.8, results on its +2.5 (the reference clicks on k9.8, 29.8, 33.8 and 37.8) |
| k48–52 | the groove's last bar | the exit, with a whoosh |
| k52–60 | the breakdown | the benefit line |
| k60–68 | the hit, the groove back | the capsule end |

```json
"music": {"file": "fit/monume-product-launch-review.mp3", "bpm": 80, "downbeat": 0.012, "edit": [[0, 4], [0, 48], [88, 104]], "fade_out": 2.2, "true_peak": -3},
"sfx": [
  {"type": "swoosh", "beat": 8, "gain": -3, "seed": 81, "dur": 1.4, "rise": 0.75, "f1": 4200, "body": 0.6, "pan0": 0, "pan1": 0, "width": 0.55},
  {"file": "fit/sfx/cinematic-start-am.wav", "beat": 8, "gain": -6},
  {"file": "fit/sfx/mouse-click.mp3", "beats": [9.8, 29.8, 33.8, 37.8], "gain": 1},
  {"type": "swoosh", "beat": 41, "gain": -6, "seed": 84, "f1": 3000, "body": 0.6, "pan0": 0.4, "pan1": -0.3},
  {"type": "swoosh", "beat": 49.5, "gain": -6, "seed": 86, "f1": 3000, "f2": 1200, "body": 0.7, "pan0": 0, "pan1": -0.4},
  {"type": "swoosh", "beat": 60, "gain": -2, "seed": 87, "dur": 1.4, "rise": 0.75, "f1": 4200, "body": 0.6, "pan0": 0, "pan1": 0, "width": 0.55},
  {"file": "fit/sfx/cinematic-wake-am.wav", "beat": 60, "gain": -4}
],
"sfx_level": -23
```

- **The clicks:** `mouse-click.mp3` is the client's (a press and release, 0.37 s), used as supplied: it is noise
  with a short ring near 845 Hz, close enough to the track's A. List one beat per click. (Before it,
  `glass-press-am.wav`, the glass pack's press tuned from G# to A.)
- **The k41 whoosh** marks the pull-back after the app's message closes; move it onto your own biggest pull-back.
- **Hits in the track's key.** The `-am` hits are tuned to A minor. The `-dsm` ones belong to the funk track (D#
  minor), a tritone away, and would clash.
- **The track is very dynamic.** Its hits come between silences, so `music_fit.py` warns that the master is limited
  by more than 3 dB. The result reads about −14.9 LUFS, within QA.

**The funk track** (`fit/lightbeats-joyful-rhythm-walk-funk.mp3`, 115 BPM, downbeat 0.538; the first sample used
it). `B(k)` = k × 0.5217 s. Its sections and licence are in the `marsad-campaign` skill's `references/audio.md`.

**44 s** (`"duration": 43.8`, `map:'44'`):

| Film beats | Music | The walkthrough |
|---|---|---|
| k0–8 | intro (song 8–15) | the intro; the window rises from k4.5 |
| k8 | groove A starts (song 16) | the window lands; whoosh + hit |
| k8–40 | groove A | steps |
| k40 | groove B, busier hats (song 64) | the key click, and a float with a whoosh just after |
| k40–58 | groove B, then groove A (song 48) | steps; the outcome |
| k58–62 | groove A | the exit, with a whoosh |
| k62–72 | groove A, and the break (k68–71) | the benefit line |
| k72–84 | the hit (song 64) | the capsule end |

```json
"music": {"file": "fit/lightbeats-joyful-rhythm-walk-funk.mp3", "bpm": 115, "downbeat": 0.538, "edit": [[8, 48], [64, 80], [48, 64], [64, 76]], "fade_out": 2.2, "true_peak": -3},
"sfx": [
  {"type": "swoosh", "beat": 8, "gain": -3, "seed": 81, "dur": 1.4, "rise": 0.75, "f1": 4200, "body": 0.6, "pan0": 0, "pan1": 0, "width": 0.55},
  {"file": "fit/sfx/cinematic-start-dsm.wav", "beat": 8, "gain": -4},
  {"type": "swoosh", "beat": 41, "gain": -6, "seed": 84, "f1": 3000, "body": 0.6, "pan0": 0.4, "pan1": -0.3},
  {"type": "swoosh", "beat": 59, "gain": -6, "seed": 86, "f1": 3000, "f2": 1200, "body": 0.7, "pan0": 0, "pan1": -0.4},
  {"type": "swoosh", "beat": 72, "gain": -2, "seed": 87, "dur": 1.4, "rise": 0.75, "f1": 4200, "body": 0.6, "pan0": 0, "pan1": 0, "width": 0.55},
  {"file": "fit/sfx/cinematic-wake-dsm.wav", "beat": 72, "gain": -2}
],
"sfx_level": -23
```

Move the k41 whoosh onto your own big pull-back (a cue's accent lands on its beat). Keep it to the four moments.

**30 s** (`"duration": 29.7`, `map:'30'`; `films/pulse-30` uses this edit):

| Film beats | Music | The walkthrough |
|---|---|---|
| k0–8 | intro | the intro; the window rises |
| k8 | groove A | the window lands |
| k8–38 | groove A | 2–3 steps |
| k38–41 | groove A | the exit |
| k41–48 | the break (k44–47) | the benefit |
| k48–57 | the hit | the capsule end |

Use the same `music` block with `"edit": [[8, 48], [56, 73]]`. The sfx are the k8 pair, one whoosh on the biggest
pull-back (gain −6), and the k48 pair (as the k72 pair above).

## 8. The reference, beat by beat

`demos/decisions-real/`: "Decisions: approve a recommendation", on the real app's screens (six captured states:
`home`, `decisions`, `confirm`, `focus`, `done`, `after`), on the launch map (80 BPM, 51 s). It starts on the Home
page. `demos/decisions-walk/` is the same walkthrough on the site kit (clicks on k9.8 and k31.8, the executed card
floating on k33.5).

| Beats | Line | Camera | Action and result |
|---|---|---|---|
| k0–7 | "Introducing / Decisions." «تعرّف على القرارات» | — | the dark stage; from k4.5 the window rises on its back (the Home page) |
| k8 | — | lands flat, z 1 | the groove's big hit: whoosh + hit, punch 1.2% |
| k8.5–14.5 | 1 · Open Decisions | onto the top bar, the welcome and its search (NP(930,286), z 2.0, rx 2, ry −4) from k8.2; back to the page (z 1.04, rx 4, ry −5) at k12 | the hand clicks «القرارات» (k9.8, click) with the tab's hover; the Decisions page on the hit (k10.5) |
| k14.5–20 | 2 · Read the recommendation | the title (NP(952,527), z 3.0); a slow reveal of the card and the AI's reasoning (z 2.25, `sin`, 2.4 s) from k16.5 | — |
| k20–28 | 3 · Check its confidence and source | the pill row (z 3.3, ry 3); a small turn (z 3.6, rx 4, ry 10) at k24 | «ثقة 80%» floats out, green (k21–24.3); «مستند · Odoo» floats out, violet (k25.25–28) |
| k28–38.5 | 4 · Approve it, with a reason | back out to the whole card (z 1.75, ry −6) from k27.3; in toward its buttons (z 2.35, ry −8) from k28.85; the dialog (z 2.3) from k30.3; closer (z 2.75) from k34.2 | «موافقة» (k29.8, click; hover and press) → the app's confirm dialog on the hit (k30.5) → a click in the reason field (k33.8), which takes the focus → the reason typed from the hit (k34.5, 18 cps) → «تأكيد الموافقة» (k37.8, click) |
| k38.5–47.5 | 5 · Approved, and the Odoo action runs | the message (z 3.0) from k38.4; back out, tilted (z 1.45, rx 7, ry −10) as it closes (k41.2, whoosh); the whole page at k45.2 | «تم بنجاح» on the hit (k38.5), for the app's 2 s; the page, the card «موافق» and «نُفِّذ الإجراء», floats out, green (k41.9–45.4); the counts move on the hit (k42.5: 6 → 5, 0 → 1), a soft green ring on "approved" |
| k48–52 | — | the exit | whoosh |
| k52–60 | "From recommendation to action." | — | over the breakdown |
| k60–68 | the capsule end | cut | the hit brings the groove back: whoosh + hit, punch 1.5% |
