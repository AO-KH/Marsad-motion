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
- **The stage** is the main theme's: near-black with lenses and dust (the 48 s film, `films/style-jupiter`).
- **The type** is the theme's `jt`: words blur in, a gradient on the key word, the Arabic under it.
- **The window** gets the theme's glowing rim.
- **The app's parts** float out in 3D.
- **The end** is the capsule end, and the music is the client's funk track.

**What we added** is one step line at a time, in a capsule. The client wants each feature explained, and every
line in English and Arabic. Benji needs no words; a feature explainer does.

## 2. What is on screen

- **Stage** (`#06050E`), in order:
  - the intro: three violet lenses drift;
  - the steps: one lens sits under the window, and its rim arcs up behind the window's sides;
  - the benefit: a wide lens sits low behind the line;
  - the end: a haze under the capsule.

  Dust runs throughout. The lenses shift 7% with the camera, which gives depth.
- **Window:** the engine's `M.app` window, 1360×760 at stage (280, 150). It shows the whole 1896×1060 page at
  0.717. Its rim is the theme's (`demos/kit/walk.css`); the light UI's turning beam and click ripple are off.
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

**Zoom levels in use:**

| z | Shows | Use |
|---|---|---|
| 0.62 | the window, small and tilted | the exit (the kit's) |
| 1.0–1.06 | the whole page | context; after a page opens |
| 1.5 | a whole wide card (1400 natural px) | a result that fills a card; a floating card |
| 2.2–2.9 | a group: two stat cards, half a card | reading a group; numbers changing |
| 3.5–4.2 | a line of text, a pill, a pair of buttons | the thing itself |

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
- **Text size.** Site-kit body text is 16–21 natural px: at z 3 that's 34–45 px on screen. A 28 px title reaches
  60 px. Aim for 30 px or more on the subject.
- **Keep the capsule clear.** It covers y 946–1030. Centre the subject at or above the middle, so nothing that
  matters goes below y 900.
- **Whole lines.** A 627 natural px title fits whole at z 3.5 (1575 px on screen). Cutting a line the viewer must
  read looks like a mistake; cutting context at the frame's edge is fine.
- **Window edges.** At high zoom near a page edge, the window's rim and the stage show. That is good for a moment,
  because it shows the window as an object. Keep it under about a quarter of the frame.
- **Sparse subjects.** A lone pill in a wide empty card leaves the frame mostly white. Zoom closer (z about 4),
  turn the empty side away (ry 12), and float the pill out. Or frame it with its neighbours.
- **RTL.** The app reads from the right, so reading moves go right to left, and a title's start is its right end.

## 5. Actions, states and floating parts

- **Clicks:** `app.click(t, target, {ax, ay, lead, dur})`.
  - Aim at the lower part of the label (`ay` 0.7–0.92), so the hand never covers it.
  - The glide takes `lead` 1.1–1.5 s and `dur` 1.0–1.2 s.
  - Bring the pointer in first with `app.cursor(t, NP(x, y), {dur: 0.15})`, from inside the frame's lower right.
  - Land the key click on a strong beat. On the 44 s map that's k40, where groove B comes in.
- **Page changes:** `app.page(click + 0.25 s, key)`. Pull back to the whole page about 0.9 s later; the new page is
  the result.
- **State changes:**
  - `app.show(t, sel, {from:'none', scale:0.97, dur:0.45})`: a card appears. At 0.45 s it snaps like the app;
    0.8 s ghosts.
  - `app.count` and `app.text`: numbers and labels.
  - `app.type`: typing, at 14 characters a second.
  - `app.toggle`, and `app.set` for anything else, such as a button's press.
- **Floating parts:** `lift(spec, a, b, {glow, depth, up, down, hide, display})`.
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

## 7. The two music maps, with their effects

The track is the client's funk track (`fit/lightbeats-joyful-rhythm-walk-funk.mp3`, 115 BPM, downbeat 0.538).
`B(k)` = k × 0.5217 s. Its sections and licence are in the `marsad-campaign` skill's `references/audio.md`.

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

`demos/decisions-walk/`: "Decisions: approve a recommendation", 44 s map. It starts on the Business Pulse page.

| Beats | Line | Camera | Action and result |
|---|---|---|---|
| k0–7 | "Introducing / Decisions." «تعرّف على القرارات» | — | three lenses; from k4.5 the window rises on its back |
| k8 | — | lands flat, z 1 | whoosh + hit, punch 1.2% |
| k8.5–17 | 1 · Open Decisions | dives onto the tabs (NP(1400,230), z 2.7); pulls back to the page (z 1.06, rx 4, ry −5) at k12.9 | the hand clicks «القرارات» (k11.75); the page opens (k12) |
| k17–25 | 2 · Read the recommendation | the whole title, large (z 3.5); a slow reveal of the card (z 2.7) from k19.6 | — |
| k25–34 | 3 · Check its confidence and source | the pills (z 3.6); across with a hop to «المخزون · Odoo» (z 3.9, ry 12) at k29.25 | «ثقة 80%» floats out, green (k26–29.4); the source floats out, violet (k31–33.9) |
| k34–46 | 4 · Approve it | the buttons (z 2.8, hop); back out to the card, tilted (z 1.5, rx 7, ry −10) at k40.6 | the hand clicks «موافقة» on k40; «تم تنفيذ الإجراء» appears (0.45 s) and floats out, green (k41.9–45.8) |
| k46–58 | 5 · It's recorded right away | the counters (z 2.25); closer (z 2.9) at k51.5; the whole page at k54.5 | approved 0 → 1, under review 6 → 5, and the filter tabs (k48.25); a soft green ring on "approved" |
| k58–62 | — | the exit | whoosh |
| k62–72 | "From recommendation to action." | — | held through the break |
| k72–84 | the capsule end | cut | whoosh + hit, punch 1.5% |
