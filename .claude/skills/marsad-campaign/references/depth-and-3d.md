# Depth and 3D

The client's standing note is "make this 3d": pages and parts never lie flat. The two films use three levels of depth. Choose by the grammar.

## Contents
- Level 1: parts in CSS 3D (the shots grammar)
- Level 2: a drawing seen by a real camera (the one-camera grammar)
- Level 3: pages standing as glass slabs, their parts floating out
- Checks

## Level 1: parts in CSS 3D (the shots grammar)

The 48 s film and the starter place each part in a `perspective: 1600px` container (`perspective-origin: 50% 45%`) with `T3(x, y, w, h, {z, rx, ry, rz, s})`: the part's centre at (x, y), pushed back by z, then turned.
- **A page flies over:** tilted back (rx 66°) and low, it rises and turns up to rx 16° while pulling back (z −150 → −780). The move is `ez.ioC` for the angle and `ez.dec` for the rise, over one shot.
- **A page swings in:** from the side, turned (ry −44° → −14°) and far (z −1400 → −820), then it drifts a little for the rest of the shot (the starter's Decisions).
- **Depth of field:** a part far from the focus plane is blurred, `min(10, |z + 150| / 60)` px, and fades in from 10 px more. It drifts on slow sines (periods of 11–13 s) with a few degrees of turn. Never bob it on the beat.
- **A card before a click** settles flat (rx and ry to 0) before the cursor lands, so the click point is exact.
- **The app's real screens as plates** (`films/whatif-38`, from `tools/app_shot.js`):
  - Draw a plate at the size it shows on screen: its CSS width and height are the box it fills, and its transform has no scale-up. Chrome rasters a 3D-transformed layer at about its own size, so a small plate scaled up in 3D comes out soft in the 4K final. The 5× screenshots leave room for close-ups.
  - The app's states are its own screenshots. A panel opening is a layer with the next state's screenshot fading in over 0.12 s. Typing is one screenshot per character, stepped on `M.FQ(t)`. A result snaps in, as the app does.
  - A part lifts off its plate as a box of the same picture (`part(plate, src, box, k, full)`), positioned by the box `shots.json` gives.
  - Prefer each part's own crop (`pages/<state>-<part>.png`, `background-size: 100% 100%`) to a box of the whole page: a 7200 px page decodes to over 100 MB in every render job (`films/style-jupiter`'s `plate` and `over`).
  - Typing from one screenshot: lay the typed state's field over the focused empty one (captured with a space typed, so the placeholder is gone) and uncover it right to left, one step per character on `M.FQ(t)` (`clip-path: inset(0 0 0 Xpx)`), with a drawn caret at the edge (`films/style-jupiter`, the assistant).
- **A real part lifting out of its page:**
  - Make the part a child of the page element, with `transform-style: preserve-3d` on the page. Move it along the page's own normal with `translateZ(d)` (the starter lifts the executed card by 170 px and scales it 1.08, glowing green).
  - The page element can't have `overflow: hidden` (it flattens the 3D). Round it with `border-radius` on its background.
  - Blank the part's slot in the page image (see level 3), or the lifted part leaves its double behind.
- **A graph that turns** (the Knowledge Map round the mark): don't tilt a CSS plane of chips, because the chips tilt with it. Project each node yourself instead:
  - the angle `a` on an ellipse, `x = cx + Rx·cos(a+θ)`, `y = cy + Ry·sin(a+θ)`;
  - depth `z = −D·sin(a+θ)`, scale `f / (f + z)`, and z-order by depth;
  - turn θ slowly (26° over the shot). Lights run along the links.

## Level 2: a drawing seen by a real camera (the one-camera grammar)

The ontology film draws Marsad's layers as tiers in perspective, after Palantir Foundry's ontology animation, and moves one camera through them. The code is in `films/ontology-main-theme/film.js` under "the drawing".

- **Camera:** `camOf(target, distance, yaw, pitch)` and `pj(c, x, y, z)` → `{x, y, s}`.
  - World axes: x across, y depth (small y is the front), z up. `FOC` 1150, the screen centre at (960, 520).
  - `CAMK` holds keys `[time, target, distance, yaw°, pitch°]` (yaw 0 and pitch 36° by default), each segment eased with `ez.ioC`.
  - The moves used: a drift (the target slides 160–400 units), a crane (the target rises a tier), a circle (yaw −8° → +7° with a push in, 2150 → 1820), and a pull-back to the whole stack (distance 5200).
- **Near clipping:** clip every polygon and every line's end to the part in front of the camera (`clipPj`, `NEAR` 90). Without it, a tier behind or above the camera projects as giant white wedges.
- **Plates (tiers):** a top face (or, when the camera is below the tier, its underside), the front band and the side band the camera sees.
  - Dark violet glass: `rgba(18,10,36,0.9)`, a lavender rim `#D8B4FF` over a 7 px soft magenta stroke.
  - The bands carry a violet-to-black gradient.
  - Hide what stands on a tier while the camera is below it (`seesTop`).
- **Objects:** isometric icons (`I(x, y, z)`, `box`, faces laid on by `onXF`/`onYF` matrices) with dark violet faces, lavender lines and violet and pink accents.
  - They stand upright as billboards scaled by the projection, with `vector-effect: non-scaling-stroke`.
  - Each stands on a small lens: its pad is the lens gradient (`RIM` as an SVG `radialGradient`).
- **Cables and links:**
  - Cables are screen-space cubics with vertical tangents, dashed, their dash offset flowing. A light runs along each now and then, never on the beat.
  - Links carry a pill with the app's Arabic label and API name (`صادرة إلى · billed_to`).
- **Labels:** screen-aligned HTML at projected points (`place()`), scaled 1.45–1.7 × the projection scale.
  - Put type names above the icons and link names at a fraction along the links. At plate level, they collide.
  - Put a record's card in the empty sky above the plate's back, with a callout line to its object.
  - Fade names that would fall off the frame's foot, and bring them back when the camera pulls away.
- **The hook's icon rings** (after Ringwriter):
  - Each icon kind is one `<g>` in `<defs>`, and rings of `<use>` elements place it, upright.
  - Icons land ring by ring with a small pop, and drop out and return now and then.
  - All rings turn the same way, the inner ones faster; opposite directions trip QA's shake check.
  - They spin into the centre for the turn. The layer has one `drop-shadow` glow, and a `mask-image` clears it under the line.
- **An action:** a gradient pill ("إعادة التوريد · Restock") rises along a curved path from its object on one tier to a page on the next, in 1.5 beats (`ez.sin`). What it lands on then lifts out (level 3).

## Level 3: pages standing as glass slabs, their parts floating out

This is the answer to "make this 3d" in the ontology film's top tier, and it works for any page inside a perspective drawing.

- **A slab is a box on a hinge.** Its back-bottom edge is the hinge on the plate.
  - `e` runs from 0 (the page lying on the plate) to 1 (standing, leaning back 12°, turned by `ang` to face the middle, and the side ones sliding in to `hx`).
  - Local coordinates: a across, b up the page, c out of it (0 is the back face, `ST` the page).
  - Size: width 880, bezel 14, the height from the screenshot's aspect, thickness 24.
  - Stand them one after another, 0.8 s each (`ez.ioC`), an 8th apart.
- **Faces:** draw only the faces turned to the camera. A convex box needs no other sorting.
  - A dark front bezel (`#150B2B`) with a bright rim (`#F2E2FF`) over a 12 px soft glow stroke.
  - A lighter top (`#3E1A78`), darker sides (`#2A1256`) and bottom (`#1C0B3A`).
- **The arc:** the three slabs stand turned ±22° toward the middle, the side ones slid in. This way the camera can circle close and all three pages and their labels stay in frame.
- **The page on the face:** map the screenshot at its own size (1896 × 1060 CSS px) onto the face's inner quad with `homog(q, w, h)`, a `matrix3d` homography of the four projected corners. A natural-size element scaled down stays sharp.
- **Parts float out:**
  - Each part is a `div` whose background is the same screenshot (`background-size: 1896px 1060px`, `background-position: -x -y`).
  - It is mapped onto a quad parallel to the face and moved out along the normal by 50–135 units, staggered a 16th apart after its slab stands.
  - Give lifted parts a rim and a soft shadow that grow with the lift.
  - Parts that worked: Business Pulse's three recommendation rows and its "توليد توصيات" button; Decisions' four counters; the Assistant's bot icon, suggestion chips, input and "محادثة جديدة" button.
- **Blank the slots:** in the page underneath, fill each part's slot (with its shadow) with the page's own colour, and save the result as the film's `pages/<page>_base.png`.
  - Flush, the part covers its slot exactly. Lifted, it leaves an empty slot, and the parallax shows the depth.
  - Without the blanking, every part has a ghost. Find a part's exact box by scanning the screenshot for its edge or its colour.
- **The payoff lifts furthest:** the Decisions page's own "تم تنفيذ الإجراء · PO-2291" card lifts 190 units, grows 10% and glows green when the action lands. It settles back as the camera pulls away, so the stack reads clean. (Since the feature catalogue, lift an approved card or the passport's seal instead: the follow-up after approval is switched off.)
- **Reflections:** each page also lies mirrored in the plate's top.
  - It is the same image on the quad reflected through the plate's plane (`z → 2·Z2 − z`), masked to fade away from the hinge.
  - It is clipped to the plate's top with `clip-path` in screen pixels on a wrapper, at about 24% opacity.
- **Layering:** each slab is its own container (its SVG faces, its page, its parts), sorted by depth each frame. The containers' parent is isolated (`isolation: isolate`), so their z-indexes can't rise over the labels.

## Checks

- **Peak speed.** An `ioC` ease peaks at 3 × the average speed. A long move over a short time strobes, even with motion blur.
  - Check the peak px per frame before rendering, and use `ez.sin` (1.57 ×) and more time for long glides.
  - Render the fast frames again with 16 samples.
- **Everything in frame.** In a circle or a push-in, check stills at both ends: no label or page title cut by the frame's side.
- **No shake.** Neighbouring things moving in opposite directions (rings, a formation gathering from both sides) trip QA's shake check. Turn rings one way, and scatter things near where they will land.
- **The hidden-parent measure.** A shot's elements measure 0 while the shot is hidden. Measure once shown, and don't cache a 0.
