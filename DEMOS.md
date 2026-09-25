# Marsad demo videos — the guide

This repo can turn a short script into a Marsad product demo video, rendered in **16:9 (1920×1080)** and
**9:16 (1080×1920)** from the same source. Two kinds are supported:

- **Short feature demos** (about 20–60 s): a title, the real app in action, one bilingual caption per idea,
  and an end card. Example: [`demos/pulse-short/`](demos/pulse-short/demo.js).
- **Step-by-step walkthroughs** (about 45 s – 3 min): numbered steps with a progress rail, the cursor
  clicking through a workflow, highlights and callouts. Example:
  [`demos/decisions-walkthrough/`](demos/decisions-walkthrough/demo.js).

There is no voiceover: music and bilingual English/Arabic captions carry the story.

The two finished ads (the 63 s campaign film and the 54 s "Know. Watch. Decide.") are separate; see
[`HANDOFF.md`](HANDOFF.md). New videos use the demo engine described here.

## 1. Quick start

```bash
npm install                                   # once (playwright; Chromium: see README for Windows)
./build_demo.sh pulse-short                   # -> out/pulse-short-16x9.mp4 and out/pulse-short-9x16.mp4
./build_demo.sh decisions-walkthrough 9x16    # one format only
```

Each build writes the pages to `build/`, fits the music to `out/<slug>-music.wav`, renders the frames to
`frames/<slug>-<format>/`, muxes the MP4 and runs the QA check (section 8). Final builds have motion blur:
`render_mb.js` renders four sub-frames per frame and `tools/blend.py` averages them. This takes about 8 minutes per
format for 60 s. `SUB=1 ./build_demo.sh <slug>` makes a quick draft without blur, about 4× faster.

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
app.show(t, target, {from:'below'|'above'|'left'|'right'|'none', dist, scale, dur, display})
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
Everything must be a pure function of `t` (no timers, no randomness except the seeded `mulberry`). Motion blur
renders sub-frames around each frame. Anything that changes in steps (a number, typed text, a label swap) must use
the frame's time `Math.round(t*30)/30`, or it ghosts; `count`, `text`, `type` and `toggle` already do.

## 6. Pages and screens

### 6.1 Site-kit pages

| Key | Page | Useful targets |
|---|---|---|
| `home` | المؤسسات (organisations) | `.sk-input`, `.sk-card`, `.sk-btn`, `text:` |
| `pulse` | نبض الأعمال (Business Pulse) | `#genBtn`, `#advCard`, `.sk-toggle`, `#recRows .sk-rec`, `.sk-pill.new` |
| `decisions` | القرارات (Decisions) | `#stats .sk-stat`, `#segTabs`, `#decCard`, `#btnOK`, `#toast` (hidden until shown), `#dec2` |
| `assistant` | مساعد مرصد الذكي (AI assistant) | `.sk-input` (type here), `.sk-card`, `.sk-btn` |
| `objectTypes` | أنواع الكائنات (object types) | `.sk-item`, `.sk-seg`, `text:` |
| `knowledgeMap` | الخريطة المعرفية (knowledge map) | `.sk-item`, `text:` |
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
- Known tracks:

  | File | Length | BPM | Downbeat | Shape |
  |---|---|---|---|---|
  | `fit/product-video.mp3` (SoundSurfer "Product Video") | 117 s | 88.0 | 0.016 | k0–3 intro, groove k4–67 (phrases start on k4, k20, k36, k52), a stop on k70–71, quiet breakdown k72–87, build k88–99, drop on k100, groove to the end on k164 (111.8 s). The kick is on beat 4 of the bar |
  | `fit/stylish.mp3` (SoundSurfer "Stylish") | 75 s | 94.0 | 0.041 | k0–3 near silence, k4–7 build, k8–71 groove, k72–79 quiet breakdown, groove from k80 |
  | `fit/music54.m4a` (from the old 54 s cut) | 54 s | 95.96 | 0.03 | k0–15 quiet intro, drums from k16 (10 s), breakdown k48–79, drums back k80 |

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
| [`pulse-short`](demos/pulse-short/demo.js) | Short feature demo (**the reference**) | 30 s | `product-video.mp3` | Business Pulse: the daily advisor switches on, new findings, a stock alert with highlight and callout. v2 (2026-09-25): Western digits (18%), the click on the switch not its label, clean edges (the alert whole in 9:16), motion blur |
| [`search-walkthrough`](demos/search-walkthrough/demo.js) | Walkthrough, 3 steps (the skill's test run) | 41 s | `product-video.mp3` | Search across all your data: open Search from the Data sidebar, type «فاتورة», results from Odoo, WhatsApp and files. `pages.js` rebuilds the search page. **To confirm with the client before use:** the files result row and its pills are invented, and the route through the Data sidebar |
| [`decisions-walkthrough`](demos/decisions-walkthrough/demo.js) | Walkthrough (**the reference**) | 60 s | `product-video.mp3` | Approve a recommendation in 5 steps: open Decisions, pick, check confidence and source, approve, counters update. v2 (2026-09-25): closer tab click with the label visible, callouts clear of content, readable 9:16 framing, Western digits, motion blur. v3 (same day): every hold clean in `tools/cutcheck.js`, glide out as the new page fades in |
