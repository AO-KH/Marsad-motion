# Marsad demo videos — the guide

This repo turns a short script into a Marsad product video.

**Walkthroughs, the method since September 2026.** The client gives a feature of the SaaS and gets a video that
explains it by using the real app. The method takes Benji Taylor's "Live Studio" walkthrough and the launch videos at
notes.apoorv.xyz/launch-videos as its reference ("take these video for the walk through and take them as reference
… keep the marsad and NASL theme").

- **On screen:** the real app in a window on Marsad's main-theme stage (dark, with soft glows only), and a camera
  that dives onto each click, with a click sound on every click. The app's own states change.
- **The lines:** one step line at a time, English · Arabic, in a dark capsule.
- **The 3D:** the parts that prove the feature float out of the page.
- **The ending:** the benefit on the stage, then the capsule end.
- **The format:** the client's launch track (Monume, "Product Launch Review"), 16:9, 51 s; the funk track's 30 s
  and 44 s maps also work.
- **Where it lives:** the machinery is the walkthrough kit (`demos/kit/walk.js`, `walk.css`; §5.1), and a
  walkthrough's `demo.js` holds only its steps.
- **The reference** is [`demos/decisions-walk/`](demos/decisions-walk/demo.js), the first sample, sent for the
  client's approval.
- **The procedure** is the `marsad-demo` skill.

**The earlier light-style videos** (short feature demos and step walkthroughs with a progress rail, in 16:9 and 9:16)
are the previous method: [`demos/pulse-short/`](demos/pulse-short/demo.js) and
[`demos/decisions-walkthrough/`](demos/decisions-walkthrough/demo.js) are its references. The rest of this guide
still describes the engine they share.

There is no voiceover: music and bilingual English/Arabic lines carry the story.

The two finished ads (the 63 s campaign film and the 54 s "Know. Watch. Decide.") are separate; see
[`HANDOFF.md`](HANDOFF.md). New videos use the demo engine described here.

## 1. Quick start

```bash
npm install                                   # once (playwright; Chromium: see README for Windows)
JOBS=6 ./build_demo.sh decisions-real 16x9    # a walkthrough (the kit, real screens): -> out/decisions-real-16x9.mp4 (4K)
python3 tools/fast_ranges.py decisions-real --run   # then 16 sub-frames on its fast camera moves, re-mux, QA
./build_demo.sh pulse-short                   # a light-style demo: -> out/pulse-short-16x9.mp4 and -9x16.mp4
```

Each build writes the pages to `build/`, fits the music to `out/<slug>-music.wav`, renders the frames to
`frames/<slug>-<format>/`, muxes the MP4 and runs the QA check (section 8). Final builds have motion blur:
`render_mb.js` renders four sub-frames per frame and `tools/blend.py` averages them. Finals are **4K** (3840×2160):
`SCALE=2` is the default, so the pages are drawn at twice the pixels (the client found 1080p soft: "the resolution is
bad here"). They render in chunks of 150 frames, each blended before the next, and the encode keeps the MP4 under
29 MB (crf 20, raised if needed). A 51 s 4K final, with `fast_ranges.py`, takes about 45 minutes; `SCALE=1` gives a
1080p final in about 15. `SUB=1 ./build_demo.sh <slug>` makes a quick 1080p draft without blur, about 4× faster.

To fix a few seconds after a full build, re-render only those frames and re-mux:

```bash
python3 tools/make_demo.py <slug>
SCALE=2 node render_mb.js 4 build/<slug>-16x9.html frames/<slug>-16x9 4 400 450   # frames 400-449 (30 fps), 4K like the rest
python3 tools/blend.py frames/<slug>-16x9
ONLY=audio ./build_demo.sh <slug>                                         # re-mux the MP4 and run QA on the frames
```

Start a new demo by copying the closest example:

```bash
cp -r demos/pulse-short demos/my-feature        # or demos/decisions-walkthrough
# edit demos/my-feature/demo.json and demo.js, then:
python3 tools/make_demo.py my-feature && python3 tools/stills.py my-feature 8,11,20,23 --beats   # review sheets, both formats
./build_demo.sh my-feature
```

Preview while writing: open `build/<slug>-16x9.html` in Chrome, and add `#t=12.5` to the URL to see that
second (or call `SEEK(12.5)` in the console). `tools/stills.py` writes `style_audit/<slug>-stills-<format>.png`,
a labelled sheet per format, and keeps each still at full size next to it. `node tools/cutcheck.js <slug>` lists
every hold where the window's edge slices a line of text, with the nearest clean view centre.

The procedure and the quality bar live in the `marsad-demo` skill (`.claude/skills/marsad-demo/`). Its
`references/quality-bar.md` is the checklist to go through before any build.

## 2. The house style (the client's decisions; keep them)

These come from the client's feedback on the campaign films. The engine's defaults already follow them.

- **Look:** the Marsad web app's light UI, a soft purple glow, glass icons, the real app pages from the
  site kit. The logo end card with "Book your demo · احجز عرضك التجريبي" and marsadnasl.com.
- **Bilingual:** every caption has an English line and an Arabic line. Titles, steps and callouts too.
- **Calm pace:** entrances take 0.6–1.0 s on a decelerating ease; camera moves (focus glides) take about
  1–1.5 s. Nothing pops or snaps. Leave room: a caption holds for about two bars (5 s) or more.
- **No shaking:** no camera shake, no wiggles, no bobbing icons, no overshoot. (The client asked for these to
  be removed from the 54 s film.) The engine has no shake effect on purpose.
- **No pulsing:** nothing throbs, breathes or flashes to the beat. One-off moments (a click, an entrance)
  may land on a beat.
- **No camera cuts:** views glide; they never jump on a beat.
- **Rhythm:** place events on the music's beats (`M.B(k)`) so the video feels musical without pulsing.
- **Legible:** push in (`app.focus`) on whatever the caption talks about. In 9:16 the page is cropped, so
  every step needs a focus that keeps its subject in frame. Never shrink a wide card to fit 9:16: show the part
  that matters at a scale of at least 1.0 and pan.
- **Nothing covers what it explains:** the cursor lands beside a label, not on it (`app.click(t, target, {ax, ay})`).
  Callout boxes stay off titles, buttons and numbers (`side`, `gap`, `dx`/`dy`).
- **Western digits** (0–9) in captions, callouts and the steps rail, in both languages, as in the app's cards (the
  client's brief: digits stay Western).
- **9:16 safe zones:** keep text between about y 220 and 1600. The engine's layout does this; the bands outside it
  are covered by TikTok, Reels and Shorts UI.
- **Motion blur on final renders** (the default). A `SUB=1` draft is never delivered.

## 3. How a demo is made

1. **Brief:** the feature, the audience, short demo or walkthrough, the length, and the key message.
2. **Screens:** check whether the site kit already has the pages (section 6). If the feature is new, get
   screenshots of it and rebuild the screens as a custom page, or use the screenshots directly (section 6.3).
3. **Music:** pick a track, run `python3 tools/beats.py <file>`, and fill the `music` block (section 7).
4. **Storyboard on the beat grid:** one row per idea, with its beat, caption (EN/AR) and what happens on
   screen. Short demos: title (about 2 bars), 2–4 ideas of about 2–3 bars each, end card (about 3 bars).
   Walkthroughs: title, 3–7 steps of about 3 bars each, an outro caption, end card.
5. **Write `demo.js`** against the API (section 5). Use `M.pick(a16x9, a9x16)` where the two formats need
   different framing.
6. **Check stills** in both formats at every key moment (`render_ab.js`). Fix framing, then build.
7. **Build and QA:** `./build_demo.sh <slug>`. QA must say PASS for both formats.
8. **Deliver:** send the MP4s, then commit the demo folder (outputs are gitignored).

## 4. Files

| Path | What it is |
|---|---|
| `engine/engine.js`, `engine/engine.css` | The demo engine: formats, background, glass, titles, captions, steps, callouts, the app window, cursor, end card |
| `site_kit.js`, `site_kit.css` | The Marsad web app rebuilt as HTML: 10 pages, the top bar and tabs, sidebars, icons (`SK.ic`), pills (`SK.pill`) |
| `demos/<slug>/demo.json` | Title, duration, formats, music |
| `demos/<slug>/demo.js` | The timeline; ends with `M.start()` |
| `demos/<slug>/demo.css`, `pages.js` | Optional: extra styles; custom pages (`M.definePage`) |
| `tools/make_demo.py` | demo folder -> `build/<slug>-16x9.html`, `build/<slug>-9x16.html` |
| `tools/music_fit.py` | Cuts, loops, fades and normalises the music (-14 LUFS) -> `out/<slug>-music.wav` |
| `tools/beats.py` | Tempo, beats, downbeat candidates and a loudness map of a track |
| `tools/qa.py` | Pace, pulse and shake checks and a contact sheet of a rendered MP4 |
| `tools/stills.py` | Review stills in both formats at given times or beats, tiled into one labelled sheet per format |
| `tools/cutcheck.js` | Text sliced by the app window's edge during holds, with the nearest clean view centre |
| `render_mb.js`, `tools/blend.py` | Motion blur: four sub-frames per frame over a 180° shutter, then averaged (shared with the films) |
| `demos/kit/walk.js`, `walk.css` | The walkthrough kit (`M.walk`, §5.1): the stage, the intro, the 3D camera, the pointer's hand, floating parts, the step capsule, the exit, the benefit and the capsule end. A demo loads it with `"kit": "walk"` in `demo.json` |
| `tools/rects.js` | Natural positions of elements on a demo's pages (`node tools/rects.js <slug> '#btnOK' 'text:…'`), to aim the camera |
| `tools/fast_ranges.py` | The fast moves of a render; `--run` re-renders them with 16 sub-frames at the final's scale (4K), blends, re-muxes and re-checks; `--ranges a-b,…` redoes given ranges |
| `tools/app_snap.js`, `tools/app/` | The real app's screens (§6.0): runs the client's front end with sample data (`app/env.js`) and freezes the states in `demos/<slug>/app/capture.js` into `app/pages.js`, `app.css` and `icons.woff2` (`app/serialize.js`), checking each against the live app |
| `tools/subset_icons.py` | Cuts Material Symbols down to the icons a demo's screens use (fonttools); `app_snap.js` runs it |
| `demos/<slug>/app/` | A demo's captured screens: `capture.js` (written by hand) and the three files the tool writes |
| `films/<slug>/film.json`, `film.js` | A campaign film (the `marsad-campaign` skill): the same roles as `demo.json`/`demo.js`; the tools find a slug in `demos/`, then `films/` |
| `films/kit/kit.js`, `kit.css` | The film kit: the famous source tiles, the Marsad mark, big bilingual statements (included for `films/` only) |
| `tools/film_audio.py`, `tools/sfx.py` | A film's voiceover (Kokoro "Michael") and synthesized sound effects, mixed under or over the music by `music_fit.py` |
| `build_demo.sh` | All of the above in order |
| `render_full.js`, `render_ab.js` | Frame renderer and still renderer (shared with the films) |
| `fit/` | Music: `product-video.mp3` (117 s, 88 BPM; the examples use it), `stylish.mp3` (75 s, 94 BPM) and `music54.m4a` (54 s, 95.96 BPM) |

## 5. The engine API

Times are seconds; `M.B(k)` is beat `k` of the music (bar lines at `B(0)`, `B(4)`, `B(8)`…). `M.S8`,
`M.S16` are an 8th and a 16th note. `M.pick(a, b)` returns `a` in 16:9 and `b` in 9:16. `M.FORMAT` is
`'16x9'` or `'9x16'`.

**Titles, captions, steps, end card**

```js
M.title({at, out, icon:'pulse', kicker:'FEATURE', kickerAr:'ميزة', en:'Business Pulse', ar:'نبض الأعمال', sub});
M.caption({at, out, en:'It flags what changed.', ar:'ينبّهك لما تغيّر.'});   // fades out over 0.5 s after `out`: end it 0.5 s before the next
M.steps({at, out, list:[{at:B(8), en:'Open Decisions', ar:'افتح صفحة القرارات'}, …]});  // rail + one caption per step
M.endcard({at, cta, ctaAr, url, tag, tagAr});   // defaults: Book your demo · احجز عرضك التجريبي, marsadnasl.com
```

`icon` is any site-kit icon name: search, bell, chevDown, sparkles, plus, toggle, shapes, database, share2,
link, tag, fileUp, refresh, merge, gavel, barChart, target, layout, listX, bot, msgSquare, msgs, building,
users, hub, receipt, clipboard, listAlert, settings, folder, file, grid, grid4, history, upload, pulse,
sliders, trendUp, swap, send, check, clock, ccheck, cx, bang, maximize.

**The app window**

```js
const app = M.app({at, out, page:'pulse', view:{x, y, zoom}});   // one per demo; view = the opening framing
app.page(t, 'decisions')                 // cross-fade to another page; the tab underline slides
app.focus(t, target, {fill, scale, dx, dy, dur, max})   // glide the view to an element
app.focus(t, {x, y, w:0, h:0}, {scale})  // glide to a view centre in page px (what tools/cutcheck.js suggests)
app.focus(t, 'page', {x, y, zoom})       // back to the whole page (16:9 fits it; 9:16 shows a square crop at x,y)
app.cursor(t, target)                    // the cursor glides to an element (appears on the first call)
app.click(t, target, {ax, ay})           // moves there in the second before t, presses, one soft ring. ax/ay (0-1):
                                         // where the pointer tip lands in the element; put it beside the label, not on it
app.cursorOut(t)
app.type(t, target, 'text', {cps:14, clearAt})   // types into an input; steady caret, no blinking. The field lights
                                         // 0.5 s before the first letter: type from the beat after the click. It treats
                                         // the field's first <span> (or .ph) as the placeholder
app.show(t, target, {from:'below'|'above'|'left'|'right'|'none', dist, scale, dur, display})   // an element's first show hides it until t
app.hide(t, target, {dur})
app.highlight(from, to, target, {pad})   // a glowing ring around an element
app.callout(from, to, target, {en, ar, side:'top'|'bottom'|'left'|'right'|'auto', gap, dx, dy})   // dx/dy move the box
app.toggle(t, '.sk-toggle')              // a site-kit switch turns on
app.count(t, target, from, to, {dur, fmt})
app.text(t, target, 'new text')          // swap the text with a soft dip
app.set(t, target, (el, on, t) => { … }) // anything else, per frame
app.inject('pulse', '<div class="abs" id="alertCard">…</div>')   // add an element to a page
```

`fill` (default 0.72 in 16:9, 0.9 in 9:16) is how much of the window the element should fill. A `fill`-computed
zoom stops at 1.3 in 16:9 and 1.6 in 9:16 unless `max` says more. `scale` sets the zoom directly (natural px →
screen px; the whole page in 16:9 is 0.717, in 9:16 0.943) and is used as given, up to 2.5. The cursor fades out
if a view move carries it outside the window.
`dx`/`dy` shift the centre in page pixels. Focus is format-aware: the same call frames well in both formats as
long as the element fits; for wide elements in 9:16, aim at the part that matters (Arabic pages read from the
right).

**Targets** can be:
- a CSS selector on the page showing at that time: `'#btnOK'`, `'.sk-toggle'`, `'#recRows .sk-rec:nth-child(2)'`;
- `'text:موافقة'`: the smallest element containing that text (handy on pages without ids);
- `{page:'decisions', sel:'#btnOK'}`: another page explicitly;
- a rectangle in page pixels `{x, y, w, h}` (the page is 1896×1060);
- elements of the top bar and tabs, e.g. `'.sk-tab[data-k="dec"]'`, `'.sk-badge'`, `'.sk-search'`.

**Custom logic:** `M.track(t=>…)` runs every frame; `M.at(t0,(on,t)=>…)`; `M.tween(t0,dur,p=>…,'dec')`.
`M.mulberry(seed)` gives seeded random numbers; `M.FQ(t)` is the frame's time, for anything that changes in steps.

**For campaign films** (`films/<slug>/`, the `marsad-campaign` skill):
- `M.layer()` / `M.layer('over')`: a free layer under or over the app window, for scenes outside it. Build DOM with
  `M.el(tag, cls, html, parent)` and animate it with `M.track`.
- `M.punch(t, {amp, at, d})`: the whole stage swells into beat `t` and settles, capped at 2% (the client's calm
  rule). Use it on 2–4 big beats only.
- `app.toStage(target, t)`: where an app element is on the stage at time t (`{x, y, w, h, cx, cy, s}`), with the
  view and the window's entrance: fly a scene element onto the app (the mark into the window's logo).
- The film kit (`films/kit/`, included automatically for `films/`): `K.TILES` and `K.tile(n)` (the eight famous
  sources as glass tiles, class `k-tile m-glass`), `K.mark(w)` (the Marsad mark), `K.glow(w)` (its glow for a
  reveal), and the `k-say` statement style. `films/brand-together-30/` and `films/coffee-story-45/` are worked examples.
Everything must be a pure function of `t` (no timers, no randomness except the seeded `mulberry`). Motion blur
renders sub-frames around each frame. Anything that changes in steps (a number, typed text, a label swap) must use
the frame's time `Math.round(t*30)/30`, or it ghosts; `count`, `text`, `type` and `toggle` already do.

### 5.1 The walkthrough kit

`"kit": "walk"` in `demo.json` loads `demos/kit/walk.js` and `walk.css` before `demo.js` (the full API is in the
kit's header):

```js
const W = M.walk({map:'launch', page:'pulse',      // map 'launch' (51 s), or the funk track's '44' / '30': demo.json's music must match
  intro:{kicker:'Introducing', name:'Decisions.', ar:'تعرّف على القرارات'},
  steps:[{at:B(8.5), en:'Open Decisions', ar:'افتح صفحة القرارات'}, …],     // the capsule: one line per step
  benefit:{words:['From','recommendation','to',{t:'action.',g:1}], ar:'من التوصية إلى التنفيذ.'},
  times:{exit:58},                                  // optional: move a timing (beats)
  note:{en:'Sample data',ar:'بيانات تجريبية'}});    // optional: a small label at the top left while the app is on screen
const {app, cam, lift, NP} = W;                     // app: the M.app API; app.click also shows a hand
cam(t, {at:NP(x,y) | selector | 'text:…', dx, dy, z, rx, ry, ox, oy}, {dur, ease, hop, push});   // or cam(t,'page')
lift(target, a, b, {glow:'green'|'violet', depth, up, down, hide:[…], display, exact});   // a part floats out of the page
```

`lift` steps down from a wrapper to its only child with the same text (so `'text:'` lifts the pill, not its row);
`exact: true` lifts the element itself (a whole card). A part drawn at a scale (a node on the knowledge map, at the
map's zoom) floats at that scale, with the same glow; in the app's dark mode its recess and shadow are dark ones.
`note` is the label the feature catalogue asks for when the data is sample data.

The camera moves the window in 3D. z 1 is the whole window; dives go to 2.5–4. A zoom turns about the point that
stays put on screen. Only the tilt is a 3D transform: the zoom and pan are a flat transform painted inside it,
because Chrome draws a layer under a perspective tilt at about its own pixel size, so a zoom inside the 3D transform
came out soft at any resolution (the client: "when it zoomed to page the resolution gets bad", 2026-10-01). Floating
parts rise in a 3D twin of the window, painted 4× larger and scaled back. `hop` pulls back mid-move on long pans, and
`push` keeps the camera creeping in after it arrives. The kit adds the entrance (the window rises in on its back from
k4.5 and lands on k8), the exit, the benefit line through the track's break, and the capsule end on the hit. The
skill's `references/method.md` has the numbers (zooms, tilts, timings) and the two music maps with their sound
effects.

## 6. Pages and screens

### 6.0 The real app's screens (the client's front end)

The client sent Marsad's front end (2026-09-30: "this is marsad front end", a zip of their Nx monorepo: the Next.js
app in `apps/web`, the feature libraries in `libs/web/*`). It is **not in this repo**; unzip it anywhere. It runs here
with no backend: `tools/app/env.js` signs a demo user in, answers every API call from sample data, and serves the
fonts locally. `tools/app_snap.js` drives it through the states a walkthrough needs and freezes each one into static
HTML + CSS that the engine animates like its own pages: the app's own markup, CSS and text, sharp at any zoom.

```bash
cd <marsad-frontend> && npm ci                     # once (a few minutes); then, or let --fe do both:
cd apps/web && npx next dev --port 3000            # leave it running
node tools/app_snap.js <slug>                      # or: node tools/app_snap.js <slug> --fe <marsad-frontend>
```

`demos/<slug>/app/capture.js` says what to capture (the full format is in the tool's header):
- `viewport`: `{width: 1440, height: 805}`, the demo window's shape. The window shows it at 0.944 (site-kit pages:
  1896×1060 at 0.717), so the app's 14 px text reads at 30 px from z 2.3.
- `theme`: `'dark'` captures the app in its dark mode, which the feature catalogue asks walkthroughs to use (the
  app keeps the choice in `localStorage` `marsad.theme`); the default is light.
- `routes`: the sample data, `[method, /path/, body | (reqBody, path) => body]`; functions can keep state (after the
  approve call, the list comes back approved). Sign-in, org, workspace, rights (an admin) and the bell are answered
  already. Calls nothing answers print as `NEW` (answered `{}`): give the ones a screen needs data.
- `states`: `{key, url, run, tag, wait}` in order, in one tab. `run` drives the app with Playwright (click, fill,
  scroll) and `tag` marks elements `data-w="name"` for `demo.js` (`'[data-w=approve]'`); tags stay on an element
  while the app keeps it.

It writes `demos/<slug>/app/pages.js` (one `M.definePage(key, {app: true, …})` per state; `make_demo.py` loads it),
`app.css` (the fonts and the app's rules, scoped to `.rx-scope`) and `icons.woff2` (only the icons the screens use:
Material Symbols Outlined, Apache 2.0, subset by `tools/subset_icons.py`). It checks each snapshot against the live
app and prints the share of pixels that differ (`build/<slug>-app/<key>.diff.png`): under 0.7% is sub-pixel text
edges; more means something did not come across (an image, a font, a style).

In `demo.js` the states are pages: `W.walk({page: 'home'})`, `app.page(t, 'confirm')`. Changes the app makes in place
(a dialog opening, a field taking the focus) are best captured as their own state, then swapped on the beat
(`app.page(t, key, {dur: 0.1–0.35})`). On the captured screens:
- text fields are `div[data-rx-field]` with the app's placeholder in `.ph`: `app.type` types into them (its caret
  and the field's `rx-focus` class come on while typing);
- the app's `:hover`, `:focus` and `:active` styles apply when an element has the class `rx-hover`, `rx-focus` or
  `rx-active` (`demos/decisions-real/demo.js` has `hover()` and `press()` helpers);
- scrolled boxes keep their scroll; there are no CSS animations; a `<canvas>` (a chart) becomes a still image;
- dialogs that are `position: fixed` sit in the page's own viewport, as in the app;
- an element's box (the camera's target, a lift, `tools/rects.js`) follows CSS transforms on the way up, so the
  knowledge map's nodes (React Flow places them, and its view, with transforms) are found where they are drawn. To
  ease the map's view between two captured states, animate `.react-flow__viewport`'s transform between theirs
  (`demos/ontology-real/demo.js`, as the app's own fit view does);
- a field with `dir="auto"` keeps the direction it had when captured (left to right while empty): set
  `direction: rtl` from the first Arabic letter typed;
- nothing in a screen gets a compositing layer of its own, since under the walk camera's tilt Chrome draws such a
  layer soft and a backdrop-filter there blurs or not depending on the frames before (render jobs disagreed). So the
  engine (`flatten` in `engine.js`) pins sticky bars where they stand, drops a backdrop blur behind a fill of 80% or
  more, and gives a full-screen veil (a dialog's) a blurred copy of the screen inside it. The look is the app's.

The engine keeps the site kit's and the app's styles apart (`.site :where(:not(.rx-scope *))`, and `.rx-scope`
starts from `all: initial`), and the kit's `lift` wraps a floated copy in the same scope.

### 6.1 Site-kit pages

| Key | Page | Useful targets |
|---|---|---|
| `home` | المؤسسات (organisations) | `.sk-input`, `.sk-card`, `.sk-btn`, `text:` |
| `pulse` | نبض الأعمال (Business Pulse) | `#genBtn`, `#advCard`, `.sk-toggle`, `#recRows .sk-rec`, `.sk-pill.new` |
| `decisions` | القرارات (Decisions) | `#stats .sk-stat`, `#segTabs`, `#decCard`, `#btnOK`, `#toast` (hidden until shown), `#dec2`, `#veil` (a spotlight: raise its opacity to dim the page around `#decCard`) |
| `assistant` | مساعد مرصد الذكي (AI assistant) | `.sk-input` (type here), `.sk-card`, `.sk-btn` |
| `objectTypes` | أنواع الكائنات (object types) | `.sk-item`, `.sk-seg`, `text:` |
| `knowledgeMap` | الخريطة المعرفية (knowledge map): an older version, see below | `.sk-item`, `text:` |
| `links` | الروابط (links) | `.sk-pill`, `text:` |
| `search` | البحث في كل البيانات (search) | `.sk-input`, `.sk-pill` |
| `projects` | المشاريع (projects) | `.sk-card`, `text:` |
| `admin` | الإدارة (admin) | `.sk-input`, `.sk-card` |

Every page shares the top bar and tabs (`.sk-tab[data-k="home|pulse|data|dec|ai|proj|admin"]`, `.sk-badge`,
`.sk-search`). `site_pages/*.png` shows what each page looks like.

Limits worth knowing:
- **search:** reached from Data → «البحث والاستعلام» in the section sidebar (`.sk-side .sk-item:nth-child(5)`).
  - The field already shows «فاتورة».
  - The results are always on screen.
  - The results come only from Odoo and WhatsApp, although the subtitle names files too.
  - There is no room for a fifth row.
  - To show the search itself, rebuild the page in `pages.js` as `demos/search-walkthrough/` does: an empty field,
    and results that appear after typing.
- **knowledgeMap** is an older version of the page: its subtitle, its seven sample types and its two buttons no
  longer match the app. The real page (the «استكشاف» / «مخطط الأنطولوجيا» pills, Explore's empty state, the schema
  with its summary chip, and the details panel of a selected type) is rebuilt from the client's HTML snapshot in
  `demos/ontology-walkthrough/pages.js` as `ontologyMap`. Use that one; its header comment lists what is inferred.
- The top-bar search box (Ctrl K) is not modelled; what it opens in the real app is unknown.
- Anything you add or change on a page is invented until the client confirms it. List it when you deliver.

### 6.2 New elements on an existing page

`app.inject(page, html)` adds HTML in page pixels (use the `abs` class and a style in `demo.css`); then
`show`, `highlight`, `callout` it like any other element. `demos/pulse-short` injects a stock alert this way.
Site-kit helpers make it look native: `SK.pill('hi'|'ok'|'cat'|'new'|'src', text)`, `SK.ic(name, size, color)`.

### 6.3 New screens

For a feature the site kit doesn't have, put a `pages.js` next to `demo.js`:

```js
// built from site-kit pieces: sharp at any zoom, every element targetable
M.definePage('reports', {html: () => SK.chrome('dec') + SK.sidebar('dec', 1) +
  `<div class="sk-main side">${SK.header(['الرئيسية','التقارير'],'التقارير','…')} … </div>`});
// or a screenshot (w, h = the image size in px); target areas with {x, y, w, h} rectangles
M.definePage('newScreen', {img: 'demos/my-feature/shots/new-screen.png', w: 1896, h: 1060});
```

Rebuilt pages look best (text stays crisp when zoomed). A screenshot is quickest; use one at least as large as
the page (1896×1060 or 2× that) so zoom-ins stay sharp.

## 7. Music

No voiceover; the music sets the rhythm. The build fits it to the demo: it starts at `start`, repeats the `loop`
section if the demo is longer than the track, fades in and out, and normalises to -14 LUFS.

```json
"music": {"file": "fit/stylish.mp3", "bpm": 94.0, "downbeat": 0.041, "start": 0,
          "loop": [8, 72], "fade_in": 0, "fade_out": 3.0}
```

- `bpm` and `downbeat`: from `python3 tools/beats.py <file>`. The tempo and beats it finds are reliable;
  the downbeat is a best guess, so it prints all four candidates. Confirm by ear: sections and big hits start
  on a downbeat.
- `loop` (beats counted from `downbeat`) is only needed when the demo is longer than the track; use whole bars
  (multiples of 4) inside the steady part, so the beat grid stays aligned.
- `edit`: `[[a, b], [c, d], ...]` plays those sections of the track in order instead of one run from `start`
  (beats counted from `downbeat`), so a track's silence or drop can land where the video needs it. Film beat 0 is
  beat `a`; cut at the same place in a phrase on both sides. `films/coffee-launch/film.json` and
  `films/film63-launch/film.json` are examples.
- `stops`: `[[a, b], ...]` in the video's beats: the music drops out on beat a and comes back, in time, on beat b
  (v2 of `films/film63-launch`: a silent breath before the logo).
- The master keeps the music's dynamics: one linear gain to −14 LUFS, then a limiter on a 4× oversampled copy (the
  true-peak ceiling). The old two-pass `loudnorm` flattened quiet intros and drops whenever the gain didn't fit.
- A new track, or a sound file for `"sfx"`, needs a licence that allows commercial use and editing, confirmed on
  its own page: record it in `fit/CREDITS.md`.
- Known tracks:

  | File | Length | BPM | Downbeat | Shape |
  |---|---|---|---|---|
  | `fit/product-video.mp3` (SoundSurfer "Product Video") | 117 s | 88.0 | 0.016 | k0–3 intro, groove k4–67 (phrases start on k4, k20, k36, k52), a stop on k70–71, quiet breakdown k72–87, build k88–99, drop on k100, groove to the end on k164 (111.8 s). The kick is on beat 4 of the bar |
  | `fit/stylish.mp3` (SoundSurfer "Stylish") | 75 s | 94.0 | 0.041 | k0–3 near silence, k4–7 build, k8–71 groove, k72–79 quiet breakdown, groove from k80 |
  | `fit/music54.m4a` (from the old 54 s cut) | 54 s | 95.96 | 0.03 | k0–15 quiet intro, drums from k16 (10 s), breakdown k48–79, drums back k80 |
  | `fit/koi-discovery-oxforf-by-night.mp3` (Koi-discovery "Oxforf by Night", CC0) | 227 s | 96.67 | 0.466 | k0–63 a quiet intro (about 6 dB under the groove), k64–95 the build, the full groove from k96 to about k340, then the outro. No stop of its own: use `stops`. E minor |
  | `fit/midnight-drift.mp3` (original drift phonk, `tools/make_phonk.py`) | 96 s | 123.0 | 0.0 | 16-beat rows: intro k0–15 (filter opening), drop A k16–47, drop A2 k48–79, breakdown k80–103, build k104–111, drop B k112–143, drop B2 k144–175, outro k176–191 |
  | `fit/midnight-drift-slowed.mp3` (the same at 0.9×, with reverb) | 106 s | 110.7 | 0.0 | the same beats |
  | `fit/holizna-movement.mp3` (HoliznaCC0 "Movement", CC0) | 173 s | 96.67 | 0.218 | 4-bar rows of 16 beats. k0–31 stripped intro (bass and kick, no hats), k32–95 groove A, k96–135 groove B (brighter hats), a two-beat silence on k136–137, stripped k138–175, groove A again from k176, groove B from k240, ends k272. C minor |
  | `fit/monume-product-launch-review.mp3` (Monume "Product Launch Review", Pixabay; the walkthroughs' track) | 133 s | 80.0 | 0.012 | A half-time 160 feel, A minor. Bars of 3 s: k0–3 drums only, the groove from a big hit on k4 (3.0 s), a quiet breakdown without drums k80–95 (60–72 s), the groove back with a big hit on k96, the outro from k160 (120 s). Each groove bar hits on its downbeat and on +2.5, after a silence at +1.5–2. The walkthrough kit's `launch` map: `[[0,4],[0,48],[88,104]]`, 51 s |
  | `fit/lightbeats-joyful-rhythm-walk-funk.mp3` (lightbeatsmusic "Joyful Rhythm Walk Funk", Pixabay) | 138 s | 115.0 | 0.538 | Funk. 4-bar rows of 16 beats. k0–15 intro (bass, no hats, about 7 dB under the groove), k16–59 groove A, a one-bar break on k60–63 (the bass drops out, about 15 dB down: the track's own stop before a hit), k64–95 groove B (busier hats), k96–127 breakdown without bass, k128–159 groove C, k160–223 the full groove, k224–255 outro, one last hit on k256. Films: `style-jupiter` v2 |

  `product-video.mp3` covers walkthroughs up to about 1:50 without a loop; beyond that, `"loop": [100, 164]` repeats
  its second groove. For `stylish.mp3`, `"loop": [8, 72]`.
- New music: make sure it is licensed for commercial use.

## 8. Quality check

Before rendering, `node tools/cutcheck.js <slug>` must print `clean` for both formats: no hold where the window's
edge slices a line of text. After each render, `build_demo.sh` runs `python3 tools/qa.py out/<slug>-<format>.mp4`:

- **pace**: frame-to-frame change (0–255). The examples measure a median of about 0.05 and a max of 3.5–6.
  Anything over 12 is listed with its time (a fast move or a hard cut).
- **pulse**: change on beat frames vs. the frames around them. 1.0 means nothing pulses to the beat; above
  1.15 fails.
- **shake**: frames where the motion reverses in three or more quadrants at once. Must be 0.
- **sheet**: `style_audit/<name>-sheet.png`, a time-stamped contact sheet. Look at it.

Then watch the video once through at full size in both formats: captions readable, every callout pointing at its
target, nothing cut off in 9:16.

## 9. Troubleshooting

- **"no element … on page …"**: the target is looked up on the page showing at that time. Check the time,
  use `{page, sel}`, or a `text:` target.
- **An element that starts hidden** (`display:none`, like `#toast`): `app.show` brings it in; pass
  `{display:'flex'}` if it needs flex.
- **9:16 cuts off the subject**: add a focus for that moment, aim right of centre on Arabic pages
  (`view:{x:1260}` keeps the page title in frame), or give `M.pick` different framing per format.
- **A callout points at nothing**: callouts fade out on their own when their target leaves the window; end
  them before the view moves on.
- **Glass looks flat or flickers**: keep the `.gk` base layer in `M.GLASS(...)` (engine.css explains why).
- **Fonts look wrong in stills**: `render_ab.js` waits for fonts; in a browser, reload once.
- **Windows**: `PYTHON=python bash build_demo.sh <slug>` from Git Bash (see README).

## 10. Demos made

| Demo | Kind | Length | Music | Notes |
|---|---|---|---|---|
| [`decisions-real`](demos/decisions-real/demo.js) | Walkthrough, the new method on **the real app's screens** (**the reference**; the first use of `tools/app_snap.js`) | 51.0 s, 16:9 | `monume-product-launch-review.mp3`, the launch map; clicks: `mouse-click.mp3` | Decisions: approve a recommendation, in 5 steps, from the Home page: open Decisions (the top bar's tab) → read the recommendation (its title, then the AI's reasoning) → check its confidence and source («ثقة 80%», «مستند · Odoo», both float out) → approve it with a reason (the app's own confirm dialog: a click in the reason field, the reason typed, «تأكيد الموافقة») → «تم بنجاح», and the card, now «موافق» and «نُفِّذ الإجراء», floats out while the counts move. Six captured states: `home`, `decisions`, `confirm`, `focus`, `done`, `after`. v1 (2026-09-30), after the client sent the front end; their mouse click ("use this click sound") replaced the glass press. v2 (2026-10-01): 4K ("the resolution is bad here"). v3 (same day): "when it zoomed to page the resolution gets bad": the tilted close-ups were soft at any resolution, so the camera's zoom is now painted flat (only the tilt is 3D), the floating copies are painted 4× larger, and the screens have no compositing layers (the dialog's backdrop blur is painted). v4 (same day): its 16-sample fast moves (328 of the 1530 frames) had been rendered at 1080p by `tools/fast_ranges.py` and upscaled into the 4K video; they are 4K now (about 15% more fine detail on those frames; crf 21 to stay under 29 MB). QA PASS, −14.9 LUFS, −2.3 dBTP. Four clicks, one per bar, each at the bar's +1.8 (its silence), +12 dB over the music, the result on the +2.5 hit. Sample data: the three recommendations of the client's screen recording, with the source set to «مستند · Odoo» and the Odoo action awaiting approval; the counts 6 / 0 / 1. Invented: the reason typed; the counts are shown moving after the dialog closes (the app updates them behind it). Renderings: the stage and its glows, the rim, the camera, the pointer with its hover and press, the floating parts with their recesses and shadows, the capsule |
| [`ontology-real`](demos/ontology-real/demo.js) | Walkthrough on **the real app's screens in dark mode**, the first made from the product team's feature catalogue | 51.0 s, 16:9, 4K | `monume-product-launch-review.mp3`, the launch map; clicks: `mouse-click.mp3` | Knowledge map: from one customer to the whole business model (2026-10-01: "Make a demo about the ontology and this is your baseline on MARSAD features"), in 5 steps: start from any customer (the map's search, «الواحة» typed, the customer picked) → see everything it connects to (its invoices, orders, contract and chat; a double click on INV-2291 brings its products, its payment and a receipt while the map eases onto them) → the AI suggests a link (the receipt on a dashed «مقترح» line; «فتح الكائن», then «الروابط»: the suggested row floats out) → you confirm it (✓; «مؤكّد» floats out; «عرض في الخريطة المعرفية»: the line is solid now, and the receipt floats out) → your whole business, one model («مخطط الأنطولوجيا»: 8 record types and 9 link types; «فاتورة» lights its links). The benefit is the catalogue's end line, "Your company is a world. Marsad is its map." «شركتك عالم. ومرصد خريطته.» Ten captured states: `explore`, `search`, `customer`, `invoice`, `inv-page`, `inv-links`, `inv-confirmed`, `inv-map`, `schema`, `schema-inv`. Live features only (the knowledge map explorer, a record's page, AI-suggested links a person confirms, the map of the data model); the map stays 2D; every type has its Arabic name, and the object page's English type name is framed out. Nine clicks (the double click is two), one per bar at +1.8. QA PASS, −14.9 LUFS, −1.9 dBTP, 27 MB. Sample data, invented for the demo workspace «مساحة العرض» and labelled on screen "Sample data · بيانات تجريبية" (the kit's `note`): the customer «متاجر الواحة» (الرياض, تجزئة, a VAT number), its invoices INV-2291 (48,750, غير مسددة), INV-2307 and INV-2318, its orders SO-1184 and SO-1196, the contract «عقد توريد سنوي — متاجر الواحة», the chat «طلب توريد عاجل — متاجر الواحة», three products, the payment PAY-7781, the receipt «إشعار استلام رقم 0457» and its suggested link, and the 8 types and 9 link types with their names. Renderings: the stage and its glows, the rim, the camera, the pointer with its hover and press, the floating parts with their recesses and shadows, the capsule, the label. Eased: the new records fade in over 0.15 s (the app draws them at once), and the map's view moves between the two captured views in 0.45 s, as the app's own fit view does. Kept from the house style where the catalogue differs: −14 LUFS (it masters at −16), and the capsule's 29 px Arabic (it asks for 36 px at 1080 wide) |
| [`decisions-walk`](demos/decisions-walk/demo.js) | Walkthrough, the new method on the site kit's pages (the kit's first use; before the front end arrived) | 51.0 s, 16:9 | `monume-product-launch-review.mp3`, the launch map | Decisions: approve a recommendation, in 5 steps, starting on Business Pulse. Open Decisions (a hand clicks the tab) → read the recommendation → check its confidence and source (both float out) → approve (the click is heard in the silence just before a hit; the executed card appears on the hit and floats out) → the counters change. It uses the site kit's existing pages and data. v1 (2026-09-30): the funk track, 43.8 s, lenses. v2 (same day): the client asked for stars instead of the bubbles (the lenses) and for their launch track, so the timing moved onto the new track (80 BPM; the benefit over its breakdown) and the whoosh-hits were re-tuned to its key. v3 (same day): "remove the stars and add sfx for the click": the stage is dark with soft glows only, and each click has a soft click sound (glass-press-am) in the track's silence just before a hit, with its result on the hit. The renderings are the stage and its glows, the rim, the pointer, the floating parts with their recesses and shadows, and the capsule |
| [`pulse-short`](demos/pulse-short/demo.js) | Short feature demo, the light style (the previous method's reference) | 30 s | `product-video.mp3` | Business Pulse: the daily advisor switches on, new findings, a stock alert with highlight and callout. v2 (2026-09-25): Western digits (18%), the click on the switch not its label, clean edges (the alert whole in 9:16), motion blur |
| [`search-walkthrough`](demos/search-walkthrough/demo.js) | Walkthrough, 3 steps (the skill's test run) | 41 s | `product-video.mp3` | Search across all your data: open Search from the Data sidebar, type «فاتورة», results from Odoo, WhatsApp and files. `pages.js` rebuilds the search page. **To confirm with the client before use:** the files result row and its pills are invented, and the route through the Data sidebar |
| [`ontology-walkthrough`](demos/ontology-walkthrough/demo.js) | Walkthrough, 4 steps | 52 s | `product-video.mp3` | Your ontology at a glance: open the Knowledge Map from the Data sidebar, switch to «مخطط الأنطولوجيا», read a type and a link, select مشروع to open its details panel (a project holds many files and sits in one section). `pages.js` rebuilds the real page from the client's HTML snapshot (2026-09-27). **To confirm with the client before use:** the page opening in Explore mode, the graph's zoom (130%) and position, the panel showing only after a click, the links drawn in the brand colour when nothing is selected, the look-alike icons, and the empty search page the video starts on |
| [`decisions-walkthrough`](demos/decisions-walkthrough/demo.js) | Walkthrough, the light style (the previous method's reference) | 60 s | `product-video.mp3` | Approve a recommendation in 5 steps: open Decisions, pick, check confidence and source, approve, counters update. v2 (2026-09-25): closer tab click with the label visible, callouts clear of content, readable 9:16 framing, Western digits, motion blur. v3 (same day): every hold clean in `tools/cutcheck.js`, glide out as the new page fades in |
