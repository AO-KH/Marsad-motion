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
(`03_JupiterExchange.mp4`). `films/style-lovable` and `films/style-jupiter` are about 28 s each. They tell the 63 s
film's story on one "Movement" cut, `edit` `[[24, 58], [134, 146]]`: the groove starts on k8, the two-beat silence is
k36–37, and the hit is k38. Build a new style as a sample of this kind before applying it to a full film.

**Both styles:** they cut hard, a shot per 2–6 beats.
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
  - **Two joined lenses:** draw both, then both bodies again at 0.9 r over the inner rims, so only the outline glows.
  - **Capsule:** the joined lenses squash into a CSS capsule, whose glowing rim is made of inset box-shadows.
- **Type:** Inter 500, white, with grey (`.dim`) and gradient (`.g`) words. Words blur in where they will stand.
- **The hero:** a small word above left, the big word, and the Arabic below right. Two grey copies trail the big word's slide and stay as a slight extrude.
- **UI shots:** a real page in perspective with a glowing rim (box-shadow), pulling back and tilting up.
  - The Decisions card lies flat by the time the plain arrow cursor clicks, so the click point is exact.

## Its sound

- The music is HoliznaCC0 "Movement" (CC0), as in `coffee-launch`. The client tried "Oxforf by Night" (v2) and went back to it.
- The client wants effects **only on the transitions**: a swipe on each scene change and the cinematic hits on the two reveals (the mark, the logo). The UI itself (clicks, typing, chips) makes no sound. See `references/audio.md`.

## Still the house rules

- English and Arabic on every line, Western digits, and real app text on real parts.
- No shake. Punches stay at 1.5% or less. Nothing throbs on the beat.
- No orb behind the logo: the mark's own glow is enough.
- "Book your demo · احجز عرضك التجريبي" and marsadnasl.com at the end.
- The dark stage departs from the light house style the client set earlier. Say so when you deliver, and offer a light version.
