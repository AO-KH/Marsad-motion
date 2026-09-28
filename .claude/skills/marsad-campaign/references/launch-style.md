# The launch-video style (the client's references)

The client pointed to a collection of launch videos from X:
- notes.apoorv.xyz/launch-videos, shared in @apoorveth's post "cool launch video references for claude";
- 22 films, including Google Pomelli, Lovable, Figma, Polymarket, Jupiter, Axiom, Logan K's Google AI Studio "custom URLs", azatsol's omnipair "New Market View" and Pump.fun;
- the post's own clip opens two of them in full: azatsol's and Logan K's. Treat those two as the closest to what the client wants.

`films/coffee-launch/` recreates the coffee story in this style. Copy its helpers (`kt`, `gwrap`, `T3`, the mesh stage) for the next film in it.

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

## Still the house rules

- English and Arabic on every line, Western digits, and real app text on real parts.
- No shake. Punches stay at 1.5% or less. Nothing throbs on the beat.
- No orb behind the logo: the mark's own glow is enough.
- "Book your demo · احجز عرضك التجريبي" and marsadnasl.com at the end.
- The dark stage departs from the light house style the client set earlier. Say so when you deliver, and offer a light version.
