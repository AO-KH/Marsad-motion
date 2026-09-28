# The launch-video style (the client's references)

The client pointed to a collection of launch videos from X:
- notes.apoorv.xyz/launch-videos, shared in @apoorveth's post "cool launch video references for claude";
- 22 films, including Google Pomelli, Lovable, Figma, Polymarket, Jupiter, Axiom, Logan K's Google AI Studio "custom URLs", azatsol's omnipair "New Market View" and Pump.fun;
- the post's own clip opens two of them in full: azatsol's and Logan K's. Treat those two as the closest to what the client wants.

Two films are built in this style:
- `films/coffee-launch/` recreates the coffee story (48 s).
- `films/film63-launch/` recreates the 63 s launch film (63 s). It keeps the original's story and lines, has no voiceover, and adds the moves below.

Copy the helpers (`kt`, `gwrap`, `T3`, the mesh stage) from the newer one: its `kt` also takes line breaks (`'\n'`), a left-aligned column (`align:'left'`, `x`, `w`) and one start time per word (`ats`).

## What the references share

- **One idea at a time, in big type.**
  - Words or short phrases (1–5 words) at 100–130 px, centred, built word by word ("Introducing" → "Introducing the New Market View"; "Know" → "Know more. Move smarter").
  - Key words carry a gradient fill.
  - Icons, logos or chips sit inline in the sentence ("custom 🔗 URLs", "Trade [logo] BASE", "Create a brand book [button] in minutes").
- **The product as parts, not screens.**
  - One UI part is lifted out and blown up on an empty stage: a URL field, a "Publish" button, a toggle, a price.
  - The part floats in 3D with a tilt and glows at the edge (a rainbow or brand-colour border).
  - A cursor clicks the one button that matters, and the result follows (Published, Executed, +$85).
- **Continuous motion.**
  - Half of the 22 have no hard cut at all. The camera zooms through one element into the next: a field becomes the scene, a number becomes the hero.
  - When they do cut, it is fast (Figma about 2 s a shot; organicbond 0.4 s).
- **The stage.**
  - Black or a dark brand-colour mesh gradient: azatsol, Logan K, Polymarket, Axiom, Jupiter.
  - A few are bright: Pomelli, Pump.fun, Umbra, Figma. The UI keeps its own light colours on the dark stage.
- **The ending.** A benefit line in the same kinetic type, then the logo and the URL, often in a glowing pill or with a call to action.
- **Measured** (ffmpeg scene detection, `tools/beats.py`-style tempo):
  - length 8–87 s, median about 26 s;
  - music tempo roughly 86–136 BPM (azatsol's about 96, the pace of `fit/stylish.mp3`);
  - loudness −7 to −25 LUFS.

## How we build it

- **The stage:** `#bg{visibility:hidden}` in `film.css`, then a canvas in the first `M.layer()`.
  - Paint it near-black (`#07040D`) with 4–5 slow radial blobs in the brand purples, composited with `screen`.
  - Its strength follows the scenes from a keyframe list: dim for type on black, full for reveals. Nothing moves on the beat.
- **Kinetic type (`kt`):**
  - Each word fades up out of a 14 px blur over 0.55 s, one per 8th; the Arabic line follows one 8th after the last word.
  - The whole line blurs up and out in 0.4 s.
  - Every line is bilingual: English 60–120 px, Arabic about half that. Class `g` gives a word the brand gradient.
- **Floating UI parts (`gwrap`):**
  - A conic gradient ring (2 px) plus a blurred copy behind it, with the angle turning slowly (`--a`, about 26°/s).
  - Place the part in a `perspective` container with `T3(x, y, w, h, {rx, ry, s})`.
- **Real app parts on a film stage:** take them from the site kit (`SK.decContent()` → `#decCard`, `#toast`).
  - Wrap them in `<div class="site m-site">`: the site kit's layout rules are scoped under `.site`. Without the wrapper the card falls into normal flow and its title vanishes.
- **The big click:**
  - Zoom so the button, not the card, stays centred: scale about the button and move it to the stage centre.
  - The cursor's tip lands below the label, and one ring follows.
- **Zoom-through:**
  - Scale the old element about its point of interest while that point glides to where the new element sits.
  - Fade the old one out only once the points meet.
  - Match the sizes: the card's 44 px figure × scale = the hero's 260 px × its opening scale.

## Moves added by film63-launch

- **Fly through the logo:** scale the mark about an empty point inside it (the V notch of the M, at 0.483, 0.295 of the image) while that point glides to the stage centre. The arms sweep past the camera and the next scene opens behind them. It is the mark itself, so no orb is involved.
- **A turning graph that stays upright:** do not tilt a CSS 3D plane (its chips tilt with it). Project each node yourself: angle `a` on an ellipse, `x = cx + Rx·cos(a+θ)`, `y = cy + Ry·sin(a+θ)`, depth `z = −D·sin(a+θ)`, scale `f/(f+z)`, and z-order by depth. Turn θ slowly.
- **Camera moves on groups of parts:** to zoom by `Z` about a point `F` that glides to `T`, place every part at `T + (p − F)·Z` with scale `s·Z`. The parts stay separate 3D elements, and the stats row and the card move as one shot.
- **A carousel swing between two parts:** the old part slides out to one side with `rotateY` +35°, and the new one swings in from the other side with −35°, both blurred in motion.
- **The problem looks dull:** the waiting chat has a grey edge (`gwrap(..., 'dull')`) and no glow. Only Marsad's parts glow.
- **Pitch away:** the graph group tilts back (`rotateX` 58°) and rises out of frame as the next part rises in.

## Two other reference grammars: the style samples

The client asked to see the film in the styles of two more references, Lovable (`02_Lovable.mp4`) and Jupiter Exchange
(`03_JupiterExchange.mp4`). `films/style-lovable` (28.6 s) tells the 63 s film's story on a short "Movement" cut,
`edit` `[[24, 58], [134, 146]]`: the groove starts on k8, the two-beat silence is k36–37, and the hit is k38. Build a new
style as a sample of this kind before applying it to a full film.

The client then asked for the Jupiter one **slower and with more detail**. `films/style-jupiter` v2 is 53.4 s:
- It uses film63-launch's cut without song beats 80–95, `edit` `[[16, 80], [128, 150]]`: the groove starts on k16, the silence is k72–73, the hit is k74.
- Scenes run 4–10 beats, not 2, and follow the 63 s film's scenes and lines.
- Every frame carries more: dust on the dark, the sources and real file names adrift, the waiting chat, the tiles flying into the mark, a lens bursting out of it with orbits, the Knowledge Map turning inside the dome, a real recommendation, the Decisions counters, six defence rings with their layers, the Assistant answering.
- Read this as the client's taste: shots with more to look at. On pace they moved both ways. First slower (53.4 s, then 60.5 s on their funk track), then "increase the pace": 48 s, scenes of 4–10 beats at 115 BPM (2–5 s). Aim between the extremes. About 2 s shots (v1) was too fast, and 5–7 s felt slow.
- The end: the client disliked two joined lenses (a figure-of-eight) behind "Book your demo.". It is now one wide glowing capsule (CSS, its inset glow scaled while it shrinks) that blooms on the hit and shrinks into the URL capsule. Keep text over the capsule with `z-index`.

**Both styles:** they cut hard, a shot per 2–6 beats in the short samples.
- List the cut times in `window.CUTS`, so `render_mb.js` keeps every frame's blur samples on one side of a cut.
- Switch each shot with `t >= cut`.

**Lovable:**
- **Stage:** a half-size canvas, scaled up by CSS. Big radial blobs on black: blue `#2F5BFF`, violet, the Marsad magenta `#DE0DFF`, pink, orange.
  - A black linear fade covers part of it. Each shot sets the fade's direction: diagonal for logos and type, from the top for the card.
  - The UI close-ups sit on pale lavender instead.
- **The prompt card:** dark, 1500 × 840, radius 72.
  - The question types at 108 px bold, about 20 characters a second.
  - The newest word is in a gradient. Split it only at spaces, so the Arabic letters keep joining.
  - The English follows in grey. Below it: a "+", a source chip and a white send button.
- **The hand:** a white cartoon hand (SVG); its fingertip is the hotspot.
  - A press scales it to 0.9, with a pink radial glow at the tap.
  - Push the camera in *before* the click. A fast zoom after it strobes with 4 blur samples.
- **UI close-ups:** real site-kit parts, big. The Decisions statuses as a list, like the reference's Inbox and Priority list (the middle row is a white pill with a gradient edge). The Decisions card at ×1.25–1.6.
- **Type shots:** 170 px bold white words on the gradient; cut out hard.
- **The collage:** the ten `site_pages/*.png` fly in from z +1000 into a cluster. They sit in a `preserve-3d` group that turns slowly.
- **The logo:** in white (`filter: brightness(0) invert(1)` on the mark). Small in the music's silence, big on the hit, then the URL and "Book your demo".

**Jupiter:**
- **Lenses:** painted on the canvas with a two-circle radial gradient. The inner point sits off-centre, so the rim is widest on the side facing away from it.
  - The body is dark, then indigo, violet, magenta, and pink-white at the edge (Jupiter's own lenses run navy, teal, lime).
  - An outer glow ring surrounds each lens; the drawing order makes the overlaps.
- **Lens variants:**
  - **Horizon:** a huge lens below the frame.
  - **Hero:** a lens larger than the frame.
  - **Dome:** a lens above a carousel on a wide arc (centre 960, −1300; radius 2250); each tile is rotated by θ − 90°.
  - **Bright lens:** a cream body with dark type.
  - **Rings:** transparent bodies, blended with `screen`.
  - **Two joined lenses:** draw both, then both bodies again at 0.93 r over the inner rims, so only the outline glows. The client asked to replace this shape at the end (v2 uses a capsule).
  - **Capsule:** the joined lenses squash into a CSS capsule, whose glowing rim is made of inset box-shadows.
- **Type:** Inter 500, white, with grey (`.dim`) and gradient (`.g`) words. Words blur in where they will stand.
- **The hero:** a small word above left, the big word, and the Arabic below right. Two grey copies trail the big word's slide and stay as a slight extrude.
- **UI shots:** a real page in perspective with a glowing rim (box-shadow), pulling back and tilting up.
  - The Decisions card lies flat by the time the plain arrow cursor clicks, so the click point is exact.
- **Added in v2:**
  - **The old way is grey:** the lens palette mixes stop by stop into a grey one (`mixPal`) while the waiting chat is on.
  - **The turn:** on the hit a lens bursts out of the mark (its radius 40 → 1010 px, ease-out) and covers the grey ones. Two thin orbits, each with a running light, circle it.
  - **Dust:** 170 fine specks drift up and twinkle at 0.1–0.3 Hz (never on the beat).
  - **The model:** the carousel's tiles rise into the dome; the Knowledge Map's nodes turn on a projected ellipse around the mark, with lights running along the links.
  - **Defence rings:** canvas strokes with `shadowBlur` (two of them dashed and turning), with a light sweeping the outer ring and faint ring rows below.

## A third grammar: Figma (the ontology film)

For the 30 s ontology campaign ("it is ok to use another style"), `films/ontology-30` uses Figma's launch video
(`10_figma.mp4`). It suits a film about objects and links, and it brings back the light house style.

**What Figma's film does:**
- **Stage:** a flat pale canvas (blue-grey), sometimes white, one full-bleed brand-colour shot, and a black end.
- **Headlines:** top left, about 110 px, medium weight. They type in word by word; the newest word is in the accent colour and a caret follows it.
- **Canvas grammar:** a black arrow cursor, a marquee, selection boxes with square white handles, coloured name tags, and connectors between frames.
- **The end:** the headline in a selection box, then the logo with squares at its corners.

**How we build it:**
- **One world, one camera.** Everything on the canvas lives in world coordinates inside one `transform-origin: 0 0` div. `camT` zooms by `Z` about the world point `F`, which sits at the screen point `S`.
  - Each shot is a camera setting. Shots cut hard (`window.CUTS`), and the objects keep their places across the cut.
  - The Knowledge Map's dot grid is painted on a canvas from the same camera. The dots keep their size and fade when they get dense.
- **Records:** the app's sample data (the search page's invoices, customers, the invoice line and the WhatsApp note) laid out as white cards, each with a source pill in the app's style. List them as renderings.
- **The marquee:**
  - It grows in world space from a fixed corner, and the cursor holds its moving corner.
  - Compute when it first touches each card by inverting its ease. At that moment the card gets a hover ring and straightens from its tilt.
  - On release, one group box with handles surrounds all the cards, and each card has its own outline.
- **Types:** one per 8th. The outline turns to the type's colour (the app's Knowledge Map colours) and a tag pops above the card's top-right corner.
  - The tag uses `translate(right, top) translateX(-100%)` with `transform-origin: 100% 100%`, so it needs no measuring.
- **Links:**
  - Each link is an SVG cubic path in world coordinates, drawn on with `stroke-dasharray`, with a dot at its start and an arrowhead at its end.
  - Its name sits at the curve's midpoint: the app's Arabic label and the API name (`صادرة إلى · billed_to`).
  - Anchor vertical links on the cards' left quarter, clear of the tags at the top right.
- **Follow:** light one object and dim the rest to 0.22. A double-click on it sends a light along each of its links, and each neighbour brightens as its light arrives, like the Knowledge Map's explore mode.
- **Headlines (`hl`):**
  - Words are spans that switch `visibility`, so the line never reflows. They change on `FQ(t)`, so motion blur never ghosts them.
  - The caret is absolutely placed after the newest word. Measure it only once its shot is shown; a hidden parent measures 0.
  - The Arabic starts one 8th after the English starts (not after it ends), so both read for 3 s or more in a 4 s shot.
- **The end:** on the break, the headline sits at the top in a selection box. On the hit, the box moves down to the logo landing under it; nothing else moves.

**Lessons:**
- **Keep the scattered layout close to the final one.** In the first cut, two cards crossed the whole screen on their way into formation. That looked messy, and `tools/qa.py` counted a shake because different quadrants moved in opposite directions. Scatter each card near where it will stand, with a tilt, so the tidy-up is short.
- **Keep the cards clear of the headline** in any shot where a group box surrounds them. The box's edge through the headline looks broken.
- **Check peak speeds.** An `ioC` ease peaks at 3× the average speed, and a 1680 px marquee over 0.78 s peaked at about 215 px a frame. Use `ez.sin` (peak 1.57×) and more time: 1.3 s gives about 68 px a frame.

## A fourth grammar: Palantir Foundry's ontology animation, with Ringwriter

After the Figma cut, the client sent two more references for the ontology film:
- Palantir Foundry's ontology animation, the hero of palantir.com/platforms/foundry (`Hydrate_Ontology_General_V3.mp4`, 41 s, no sound).
- "Ringwriter" by Edoardo Lunardi (8 s, shared by @kombaiselects).

`films/ontology-foundry` uses both. It keeps the Figma cut's music, length and landmarks.

**What Foundry's film does:**
- **Frame:** a white frame round a light-grey canvas. A side strip holds the logo and a turned label ("Palantir Foundry → Powered by the Ontology"). A white box cut into the canvas's bottom left carries a title typed letter by letter, the newest letter grey.
- **Plates:** a technical line drawing in perspective. Plates with hatched front edges stand in tiers:
  - data and models at the bottom;
  - the ontology in the middle;
  - analytics, workflows and integrations on top.
- **Cables:** bundles of dashed cables curve up between the tiers and flow.
- **The ontology plate:** isometric objects on pads, joined by dashed links with mint pill labels, and an asset card with a live number.
- **Actions:** action pills rise on curved lines to the top tier.
- **Camera:** it cranes from tier to tier and ends on the whole stack. It is calm, and nothing cuts.

**What Ringwriter does:**
- Charcoal ground.
- Monospace capitals set on concentric rings with dotted guides; the type grows with the radius.
- The rings turn and letters drop out and return.
- A "CLICK & HOLD" pointer label.

**How we build it:**
- **Perspective:**
  - Project with no yaw: `pj(c, x, y, z)` with pitch 36°, a focal length and a target plus distance for the camera.
  - Y is depth: small y is the front, near the camera.
  - Camera keys are eased with `ioC`, and each segment is a drift or a crane.
- **Plates and near clipping:**
  - When the camera is above a plate, draw its top face; when it is below, draw its underside. Always draw its hatched front band, a screen-space SVG pattern.
  - Clip every polygon, and every cable's end, to the part in front of the camera (`clipPj`, `NEAR`). Without it, a tier above and behind the camera projects as giant white wedges.
  - When the camera is below a tier, hide that tier's objects, labels and screens.
- **Icons:** 30° isometric art (`I(x, y, z)`), with boxes and art laid on their faces by an affine `matrix` for each face (`onXF`, `onYF`). They stand on the plate as billboards, scaled by the projection. Strokes use `vector-effect: non-scaling-stroke`.
- **Real pages on plates:** a CSS `matrix3d` homography maps a screenshot's box onto the plate's projected quad (`homog`).
- **Labels:**
  - Screen-aligned HTML at projected points, scaled by about 1.6 × the projection scale.
  - Put type names above the icons; link names sit on the links. With both at plate level, they collide.
  - Put a record's card in the empty sky above the plate's back, with a callout line to its object.
- **Titles:** the English types a letter every 0.024 s with the newest letter grey, and the Arabic types a word per 16th with the newest word grey. The font shrinks to fit the box.
- **The hook's rings:** the client asked for icons, not words, in the opening.
  - The rings carry the drawing's own isometric icons, redrawn light on dark with a second palette (`iconArt(k, true)`).
  - Each icon kind is one `<g>` in `<defs>`, placed by `<use>` elements that stay upright.
  - They grow ring by ring, land with a small pop, and drop out now and then like Ringwriter's letters.
  - The first cut set words on the rings (commit 2449aa3): SVG `textPath` on circles, one word per `tspan` so Arabic keeps its joins, words dropping out through `fill-opacity`.

**Lessons:**
- **Turn every ring the same way.** Rings turning in opposite directions, fast in the spin into the centre, trip `tools/qa.py`'s shake check (motion reverses across quadrants).
- **Keep the camera above a tier to show its objects.** In a close-up of a lower tier, the tier above is overhead: show its underside and edge, as Foundry does.

## Its sound

- The music is HoliznaCC0 "Movement" (CC0), as in `coffee-launch`. The client tried "Oxforf by Night" (v2) and went back to it.
- For the Jupiter style sample the client then supplied their own track, lightbeatsmusic "Joyful Rhythm Walk Funk" (Pixabay, 115 BPM; its map is in DEMOS.md). Its intro is only 16 beats, so the edit plays the intro's second half twice. Its own one-bar break (k60–63) is the stop before the logo's hit.
- **Moving a film to a track with another tempo:** keep the scene lengths in seconds. Map the old scene boundaries onto the new beats, one scene at a time, rather than keeping the beat numbers (at 115 BPM the same beats run 16% faster). Then line up the landmarks (the groove's start, the stop and the hit) with the new track's sections.
- The client wants effects **only on the transitions**: a swipe on each scene change and the cinematic hits on the two reveals (the mark, the logo). The UI itself (clicks, typing, chips) makes no sound. See `references/audio.md`.

## Still the house rules

- English and Arabic on every line, Western digits, and real app text on real parts.
- No shake. Punches stay at 1.5% or less. Nothing throbs on the beat.
- No orb behind the logo: the mark's own glow is enough.
- "Book your demo · احجز عرضك التجريبي" and marsadnasl.com at the end.
- The dark stage departs from the light house style the client set earlier. Say so when you deliver, and offer a light version.
