# Marsad's main theme: the look and the code

The client chose the 48 s film's look (`films/style-jupiter`) as Marsad's main theme, "fonts color and everything", and the ontology film (`films/ontology-main-theme`) carried it into a 3D drawing. Every value below comes from those two films. `assets/starter/` holds the blocks ready to copy.

## Contents
- The look in values
- The stage: one canvas, lenses, haze, dust
- Type: `jt`
- Shots and cuts
- The problem is grey, Marsad glows
- The turn: the mark lands, a lens bursts
- Real app parts on the stage
- Other set pieces in the two films
- The end: the capsule

## The look in values

| Element | Values |
|---|---|
| Stage | `#06050E`, painted every frame on one 1920×1080 canvas in the first `M.layer()`; `#bg{visibility:hidden}` hides the engine's own background |
| Lens rim (`RIM`) | stops 0 `#06050E` · 0.5 `#0A0717` · 0.7 `#150A31` · 0.82 `#2F1068` · 0.91 `#6420B8` · 0.965 `#BD3BE8` · 0.99 `#FF9BF0` · 1 `#FFD9FA`; an outer glow `rgba(206,64,240,0.32)` from 0.97 r to 1.16 r |
| Grey lens (`RIM_G`, the old way) | `#07070A` → `#22222B` → `#6A6876` → `#D2D0DA`; glow `150,148,160` |
| Bright lens (`RIM_B`) | a cream body `#FBF8FD` / `#F5EDFB` with a violet rim to `#240B4F` at the edge; dark type on it (`jt` class `dark`) |
| Dust | 170 specks, 0.8–2.7 px, `rgba(236,214,255)`, drifting up 2–10 px/s and twinkling at 0.1–0.3 Hz (never the beat) |
| Haze | a radial `rgba(150,40,220,0.14–0.32)` for shots without a lens |
| Type | Inter 500, 60–92 px (76 default), `#F4F1FA`, letter-spacing −0.025em; grey words `.dim` `#8C889B`; gradient words `.g` `#DE0DFF → #F29BFF 70% → #FFD9FA` |
| Arabic line | IBM Plex Sans Arabic (`PlexAR`) 500, about half the English size (30–44 px), `rgba(244,241,250,0.72)`, 14 px under the English |
| Chips and labels | `rgba(22,13,40,0.82)`, a 1.5 px `rgba(214,160,255,0.42)` edge, glow `0 0 22px rgba(160,60,230,0.25)`; JBMono 19–20 px for file names and API names, PlexAR 21–23 px for Arabic |
| Real app parts | white, with a glowing rim: `0 0 0 2.5–3px rgba(255,190,248,0.85–0.9), 0 0 36–40px 4–8px rgba(206,64,240,0.5), 0 0 110–120px 20px rgba(122,40,220,0.3)` |
| Brand button, action pill | `linear-gradient(90deg,#5F0DB4,#8E32C3 52%,#BC59D1)` with a `rgba(222,13,255,0.55)` glow |
| Success | the app's green (`#0B8447`, `#E7F5EE`), glowing `rgba(60,220,140,0.5)` when it lands |
| The mark | `assets_logo_m.png` with `drop-shadow(0 0 26px rgba(214,70,240,0.75)) drop-shadow(0 0 80px rgba(122,40,220,0.5))`, and a blurred copy under it (`.gl`, `blur(26px) saturate(1.6)`) whose opacity makes its bloom; never a disc |
| Capsule | body `#07050F`; rim `inset 0 0 0 2px rgba(255,215,250,0.95)`, inner glows in magenta and violet, outer glows; the URL in Inter 500 50 px |
| Footer | `NASL TECHNOLOGIES · RIYADH`, JBMono 600 17 px, letter-spacing 0.32em, 55% opacity |

## The stage: one canvas, lenses, haze, dust

One `M.track` paints the canvas every frame: fill `#06050E`, then the current shot's lenses, then dust. Keep compositions in one `if / else if` chain by shot time, so a hard cut changes the stage in one frame.

- **`lens(x, y, r, {a, lx, ly, glow, pal})`** is a two-circle radial gradient. Its inner point sits at (`lx`, `ly`) × r from the centre, so the rim is widest on the opposite side. Draw order makes the overlaps. `a` fades it, and `pal` swaps the palette (`RIM_G`, `RIM_B`).
- **Compositions used:**
  - Three lenses drifting apart: the hook.
  - A lens larger than the frame bursting out of the centre: the turn (radius 40 → 1010, or → 1700 as the drawing's ground, `ez.outC` over 0.9 s).
  - A horizon lens below the frame: `lens(960, 2285, 1500)` rising, or `(960, 2600, 1650)` at 0.55 for a quiet statement.
  - A dome above a carousel: `lens(960, 210, 850)`.
  - A lens behind a page at a corner.
  - A bright lens with dark type.
  - Rings blended with `screen` (a transparent body, `RING` palette).
  - Haze alone behind a busy UI shot.
- **`orbits(t, a)`:** two thin ellipses (1150 × 250) round the hero lens, tilted ±0.2 rad, each with one light running at 0.04–0.05 laps a second.
- **`dust(t, a)`:** always on, at 0.6–1.0.

## Type: `jt`

`jt({at, out, y, size, words, step, ar, arSize, arAt, fade, x, w, cls})` places one line and its Arabic:
- `words` holds strings, `{t, g:1}` (gradient), `{t, d:1}` (grey) and `'\n'` (a line break).
- Each word blurs in where it will stand: from 12 px of blur and 16 px low to sharp, over 0.5 s (`ez.dec`).
  - The step is one per `step` (default an 8th; `S16` or `S16*1.5` for longer lines).
  - The Arabic follows an 8th after the last word (or at `arAt`), from 8 px of blur, over 0.55 s.
- `fade: [from, to]` blurs the whole line out (8 px) before `out`. Without it the line cuts out with its shot.
- `cls: 'left'` with `x` and `w` sets a left column (the waiting line). `cls: 'dark'` sets dark type for a bright lens.
- **Placement:**
  - y 40–120 over a drawing or a UI shot;
  - y 300–470 for statements;
  - y 812 over the opening's rings, with the rings masked out under the line (`mask-image: linear-gradient(to bottom, #000 55%, transparent 84%)`).
  - Keep 64–96 px for statements and 52–60 px for long lines at the top.
- **Wording:** grey for the problem ("is **everywhere.**" in grey, "your system makes you wait." in grey) and gradient for Marsad's part ("Fully **automated.**", "One **living model.**").
- **Over the capsule:** a line on top of it takes `style.zIndex = '2'`.
- **The hero** (the 48 s film's "Marsad / changes that."): the word at 290 px slides in from the left over 0.9 s, with two grey copies trailing it that stay as a slight extrude. The small line and the Arabic blur in at its right and left ends.

## Shots and cuts

- Each shot is a full-stage div (`mt-shot`) shown only in its window: `show(el, inShot(t, a, b))`. Its stage composition is in the painter's chain.
- Hard cuts go in `window.CUTS`, on beats. `render_mb.js` then keeps each frame's blur samples on one side of the cut, so the cut stays clean.
- Continuous moments are not cuts: a flight into the mark, a burst, a crane. The 48 s film's k7 and k16 and all of the ontology film are continuous.
- A shot runs 4–10 beats. Give the eye one main element, and fill the frame with slow secondary motion.

## The problem is grey, Marsad glows

- `mixPal(u)` blends the lens palette stop by stop into the grey one (and `mixGlow(u)` the glow) while the problem is on screen (the 48 s film's k6.5–8).
- The waiting chat is a dark card with a grey edge and no glow, with typing dots at 2.3 Hz (off the beat) and a WAITING counter stepping on `FQ(t)`.
- The problem's words are grey. When Marsad arrives, the grey lenses are covered by the burst.

## The turn: the mark lands, a lens bursts

The turn happens on the groove's first beat (film k16 in the 48 s cut, k8 in the 30 s cuts):
1. **The gather.** The things from the hook (tiles, files, icons) fly into the centre, one per 16th, over the last 1.5 beats. Each takes a curved path (`ez.inC`, a sideways swing of 150 px at mid-flight), shrinking to 0.3 and fading in its last 20%.
2. **The land.** The mark's glow gathers to 0.35 beforehand. On the beat the mark eases in over 0.75 s with a 3% overshoot (the logo's only overshoot), and its glow blooms to 0.9 and settles.
3. **The burst.** A lens bursts out of it and covers the old stage. Two orbits fade in.
4. **The hit.** One punch of 1.5% (`M.punch(K_TURN, {amp: 0.015})`), and the whoosh with `cinematic-start-dsm`.
5. **The line.** The mark rises to make room for it.

In the ontology film the gather is the icon rings spinning into the centre (`ez.inC` over 1.25 beats, all rings turning the same way), and the burst lens (radius 1700) becomes the drawing's ground.

## Real app parts on the stage

- **Pages:** `site_pages/<page>.png` at their own size (1896 × 1060) in a `perspective: 1600px` container (`mt-3d`), placed with `T3(x, y, w, h, {z, rx, ry, rz, s})`, with the glowing rim.
  - Tilt them and move them, never lay them flat and still.
  - Business Pulse flies over: rx 66° → 16°, rz −7° → 0°, z −150 → −780, rising 400 px over the shot.
- **Site-kit parts** (live DOM, so text and numbers can change):
  - `SK.pulseContent()` gives the recommendation rows (`#recRows`), and `SK.decContent()` gives `#decCard`, `#toast` and `#stats`.
  - Take the element out, drop its id, give it an absolute box, and wrap it in `<div class="site m-site">`. The site kit's layout is scoped under `.site`, and without the wrapper the card loses its title.
- **The click:** a plain white arrow cursor (54 px, dark outline, soft shadow).
  - The card is flat (rx, ry 0) by the time the cursor lands, so the click point is exact.
  - The button presses to 0.95. The toast cross-fades in 0.05–0.4 s after the click, and the counters step on `FQ(t)` a beat later with a green glow.
- **Decisions before and after a click:** `site_pages/decisions.png` shows the green «تم تنفيذ الإجراء» card in the recommendation's slot (with the counters still at approved 0, under review 6). A click story needs the live site-kit parts instead: the pending `#decCard` with «موافقة», then `#toast`, then `#stats` stepping, placed over a page base with those slots blanked.
- **Floating parts, the lift, standing pages:** see `depth-and-3d.md`.
- **Only real text on real parts.** A compact element with the app's words (a toast, a pill) is invented UI: list it.

## Other set pieces in the two films

Copy these from the film named, and read its comments:

| Set piece | Film, beats | What it is |
|---|---|---|
| Tiles and files adrift | 48 s, k0–16 | The famous sources (`K.TILES`, glass tiles) and real file-name chips floating in depth, blurred by depth (`|z+150|/60` px), drifting on slow sines (periods of 11–13 s) |
| The waiting chat | 48 s, k7–16 | The problem, grey |
| The loop | 48 s, k24–28 | Connect · Unify · Monitor · Act pills (`SK.ic` icons), lit one by one on `FQ`, joined by a gradient line with a light running along it |
| Carousel under a dome | 48 s, k28–33 | The source tiles on an arc (centre 960, −1300; radius 2250), turning 2.4°/s, rising one by one into the dome |
| The turning Knowledge Map | 48 s, k33–38 | The app's object types (with their colours) and named links on a projected ellipse round the mark, z-ordered by depth, lights running along the links |
| One real recommendation on a bright lens | 48 s, k43–48 | A site-kit row on the cream lens; its "مبني على بياناتك" pill glows green |
| Decisions: the click | 48 s, k48–56 | Counters and card settle flat; the cursor clicks «موافقة»; the toast; approved 0 → 1 and under review 6 → 5 |
| Defence rings | 48 s, k56–64 | Six canvas rings snapping in round the mark one per 8th (two dashed, turning), a light sweeping the outer one, the six layers listed in EN/AR |
| «بالعربية», huge | 48 s, k64–66 | A 330 px Arabic word in gradient, then white; "Ask in Arabic." |
| The Assistant answering | 48 s, k66–74 | The app's assistant card; the Arabic question typed at 30 characters a second, sent, the answer streamed a word per 32nd, the source chip |
| Icon rings | ontology, k0–8 | Rings of isometric icons (the company's data) turning one way, dropping out and back like letters, spinning into the centre |
| Tiers, cables, standing pages | ontology, k8–44 | The 3D drawing (see `depth-and-3d.md`) |

## The end: the capsule

On the hit (K):
1. "Book your demo." (64 px, English and Arabic) blurs in at K + 0.25 s, on top (`zIndex 2`).
2. **Bloom:** the capsule opens from 420 × 300 to 1320 × 380 over 0.55 s (`ez.dec`) with a 1.5% punch.
3. **Shrink:** from K + 2.75 beats (30 s film) or K + 3 beats (48 s film), over 1 beat plus 0.3 s, to 760 × 150. The inset glows shrink with it.
   - The line blurs out just before the shrink ends.
   - The URL `marsadnasl.com` (50 px) blurs in as it lands.
4. **Then** (30 s film at K + 4, 4.5 and 5 beats; 48 s film at K + 5, 5.75 and 6.5):
   - the mark (190 px) over the capsule;
   - "Book your demo · احجز عرضك التجريبي" (36 px, y 700);
   - the footer.
5. **Hold:** the end holds to the film's last frame (4.7 s in 30 s, 6.3 s in 48 s), with a soft haze and dust behind it.

The whoosh and `cinematic-wake-dsm` land on K. Never draw two joined lenses here; the client asked for another shape, and the capsule is it.
