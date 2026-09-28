# Anatomy of the launch film, and beat maps for new films

## Contents
- The reference: the 63 s launch film, scene by scene
- What to keep, and what not to copy
- The calm variant: the 54 s film
- Beat maps for new films on `fit/stylish.mp3` (30, 45 and 60 s)
- Open questions the client hasn't settled

## The reference: the 63 s launch film

**Specs:**
- `film.html`, delivered as v6 (`./build.sh` rebuilds it).
- 63.0 s, 1920×1080, 30 fps.
- Music: SoundSurfer "Stylish" (`fit/stylish.mp3`, 94 BPM, D minor), fitted without a time-stretch and with one 6-bar jump edit.
- English voiceover: Kokoro "Michael". EN/AR captions. 21 synthesized sound effects.

**Grid:**
- Film beat k falls at `9.0197 + 0.63832·(k−8)` s.
- The song's first downbeat is at film 3.913 s, so the film opens 3.9 s before the music.

| Scene | Time (s) · beats | On screen | Voiceover | Caption EN / AR | Job |
|---|---|---|---|---|---|
| S1 | 0–4.6 | 8 glass source tiles (SAP, Salesforce, Oracle, Excel, Shopify, QuickBooks, PDF, CSV) appear 0.07 s apart and drift apart | "Your company's data… is everywhere." | Your company's data is everywhere. / بيانات شركتك مبعثرة في كل مكان. | Hook: the problem |
| S2 | 4.6–9.6 · k1–9 | A team chat, "Where are we on Q2 numbers?", typing dots, a "WAITING" timer counting up | "And when you need a quick answer — your system makes you wait." | When you need a quick answer, your system makes you wait. / حين تحتاج إجابة سريعة، يجعلك نظامك تنتظر. | Friction |
| S3 | 9.6–13.2 · k9–14.5 | The tiles spiral in and are absorbed on 8ths and 16ths; the M ignites on k12 | "Marsad changes that." | Marsad changes that. / مرصد يغيّر المعادلة. | The turn: brand reveal |
| S4 | 13.2–20.2 · k14.5–25.5 | A ring with CONNECT/اربط, UNIFY/وحّد, MONITOR/راقب, ACT/نفّذ, one per beat group | "Connect. Unify. Monitor… and act." "One workflow. Fully automated." | One workflow. Fully automated. / سير عمل واحد، مؤتمت بالكامل. | The promise, in four verbs |
| S5 | 20.2–27.4 · k26–37 | Glass file chips, then six knowledge-map objects and their links, wired into a big M hub (180 px) | "Marsad turns scattered records into one living model of your business." | Every system. One living model. / كل الأنظمة… نموذج حيّ واحد. | Proof 1: unify |
| S6 | 27.4–34.4 · k37–48 | The real app window: Business Pulse; the header, the button, the advisor card and 3 recommendations in 16ths | "It watches your business in real time, and turns your numbers into recommendations you can trust." | Real-time recommendations — from your own numbers. / توصيات لحظية مبنية على أرقامك — بلا اختلاق. | Proof 2: it watches and advises |
| S7 | 34.4–41.6 · k48–59 | Decisions: stats in 16ths, the Riyadh restock card (ثقة 80%), the cursor clicks «موافقة» on k55, the toast and the counters on k56 | "One decision." "One click." "Decision to action." "Nothing in between." | Decision to action. Nothing in between. / من القرار إلى التنفيذ — بلا خطوات بينهما. | Proof 3: one-click action |
| S8 | 41.6–48.4 · k59–70 | A shield: an M core (120 px) and 6 labelled rings snapping in on 8ths, with a radar sweep | "Six layers of defense around your data." "Sovereign, and PDPL compliant." | Defense in depth. Sovereign. PDPL-compliant. / دفاع متعدد الطبقات — بنية سيادية متوافقة مع نظام حماية البيانات الشخصية. | Trust |
| S9 | 48.4–55.6 · k70–81 (the breakdown) | «اسأل بالعربية.», the assistant panel, an Arabic question typed, the answer streaming word by word, a source chip | "Ask in Arabic." "The answer comes from your own data." | اسأل بالعربية. / Ask in Arabic. The answer comes from your original data. | Differentiator |
| S10 | 55.6–63 · k81 (the drop) | A tilted wall of app pages, the M (300 px), the wordmark, the tagline and the call to action; fade to white | "Marsad." "One operational nervous system." + the call to action | One operational nervous system. / جهاز عصبي تشغيلي واحد لشركتك. | Lock-up and CTA |

**Caption pattern:** English lands on a beat and Arabic one 8th later. In the engine, `M.caption` does this; its Arabic follows 0.25 s after the English.

The captions and voice lines above were approved by the client. Reuse them when a new film makes the same point.

## What to keep, and what not to copy

**Keep:**
- **The arc:** hook → friction → turn → promise → proofs in the real app → trust → differentiator → end card.
- **Real app pages for every product claim.** S6 and S7 use the site kit's own pages and ids.
- **The famous sources as glass tiles.** They are in the film kit: `K.TILES`, `K.tile`.
- **One carrier from scene to scene.** The client's storyboard said: "one carrier element… If a transition feels arbitrary, route it through" it. Make the carrier the mark's glow or the sources themselves, never a sphere (the orb was removed on request).
- **Big moments on the music's section changes.** The reveal is on a phrase start; the quiet question sits in the breakdown; the logo lands on the drop.
- **The logo big and alive.** It is 180 px in the hub and 120 px in the core, not the 104 and 56 px it started at. The reveal charges up on the beats.

**Don't copy:**
- **Its camera.** `TR` in `film.html` flips position, zoom or rotation exactly on the beat: whips, spins, nudges, and a 0.6 s shake at the ignition. The client had this removed from the 54 s film, and `tools/qa.py` fails the 63 s film with a shake at 34.5 s. Use `M.punch` and glides instead.
- **The flashes and the shockwave burst at the ignition.** Keep the reveal soft: absorb, glow, ease in.
- **Its call to action.** "Request a demo · nasl-tech.com" is out of date. Use "Book your demo · احجز عرضك التجريبي" and marsadnasl.com.
- **Its Arabic-Indic digits** ("٦ طبقات", "٨٫٢٪"). Captions and overlays use Western digits.
- **The section kickers** "THE PROBLEM" and "HOW IT WORKS". They are hidden in its CSS; the client asked for them to go.
- **The page wall's 3D tilt as a transition.** It is fine as a still backdrop behind the end card, but new films end on `M.endcard`.

## The calm variant: the 54 s film

The 54 s film ("Know. Watch. Decide.", `film54_src/`, v4) is the client's approved motion model. It rebuilt an older dark cut in the light style and kept that cut's music, captions and length. After "make the pace a little slower and remove the icons shaking", the client chose the same length with calmer motion:
- **Camera:**
  - No shakes, no lean or rotation, no zoom-through, and no nudges or zoom-outs on the beat.
  - Punches of 0.8–2.2% that swell in over 0.25 s. `M.punch` does this and is capped at 2%.
  - One soft rise at a moment with nothing else on screen.
- **Pages:** they cross-fade over 0.55 s, starting 0.25 s before the beat.
- **Entrances:** 0.6–1.0 s on a decelerating ease, with no pops.
- **Loops and props:** bobbing became a straight 4 px/s drift. The button's wiggle became a colour blend. The seal settles instead of slamming.
- **The logo:** its overshoot went from 20% to 4%. Flashes were cut to 0.10 and 0.30 opacity.
- **Captions:** English lands on the beat and Arabic one 8th later. Each holds 2 bars (5 s). This film has no voiceover and no sound effects.

## Beat maps for new films on `fit/stylish.mp3`

The track's grid:
- Beat k of the song is at `0.041 + 0.638366·k` s (93.99 BPM). `tools/beats.py` may guess another downbeat; this one is confirmed.
- **Sections:**
  - k0–3: near silence;
  - k4–7: build;
  - k8–71: groove;
  - k72–79: breakdown, quietest at k72–78;
  - k81: the drop. The low end jumps +16 dB on beat 2 of that bar, not on the bar line at k80.
- The track ends at 75.4 s.

Choose `"start"` so the drop lands where the end card begins:

| Film | `"start"` (song beat) | Film beat of the breakdown | Film beat of the drop = the end card | `"duration"` | Scenes |
|---|---|---|---|---|---|
| 30 s | 28.129 s (k44) | k28–35 | k37 (23.6 s) | 30.0 s (47 beats) | hook k0–8 · turn k8–16 · proof k16–28 · quiet proof k28–36 · end card k37 (the worked example, below) |
| 45 s | 12.808 s (k20) | k52–59 | k61 (38.9 s) | 45.3 s (71 beats) | hook · friction · turn · 2 proofs · quiet proof · end card |
| 60 s | 0.041 s (k0) | k72–79 | k81 (51.7 s) | 58.1 s (91 beats) | the full arc of the 63 s film, with the music from its intro |

In every map, the app window leaves about a beat before the end card (`M.app({out})`), so the card's veil rises over a clean stage.

**The worked example, `films/brand-together-30/`** (30 s, made with this skill):

| Beats | Scene |
|---|---|
| k0–8 | **Hook.** The eight sources appear one per 16th from k0.5, scattered, drifting slowly apart. Caption and voice on k1. |
| k8–16 | **Turn.** The sources glide one per 16th onto a ring around the centre, and a line draws from each to the centre. The mark eases in on k10. It lights on its own glow on k12, right after the song's one-beat stop on k11, with a 1.5% punch, and holds to k14. The sources are absorbed into it. From k15 it glides to where the window's logo will be. |
| k16–28 | **Proof.** The window rises around the mark, which becomes its logo (`app.toStage`). Business Pulse: three recommendations arrive on k18. On k22, Decisions takes over, with the page dimmed around the recommendation (`#veil`) and a source callout. |
| k28–36 | **Quiet proof, in the breakdown.** One click approves it on k31: the chime, the executed toast, the counters. The window leaves on k36. |
| k37–47 | **End card on the drop,** with a 1.2% punch. The voiceover's call to action follows on k38.5. |

The 4-beat reveal needs its hold. When the window came in on k14, the connected hub was cut short and the mark crossed the page title. Give the turn 8 beats (k8–16).

## Open questions the client hasn't settled

Say which way you went when you deliver:
- **Digits:** the client's only statement is the Monitor brief's "Digits stay Western". This skill follows it for captions and overlays.
- **Call to action:** the latest material uses "Book your demo" and marsadnasl.com. Confirm it before a paid release.
- **An Arabic voiceover:** wanted, but no approved Arabic voice exists yet.
- **The 63 s film's shake:** "no shaking" was applied to the 54 s film only, and the 63 s film still has it. Don't copy it; change that film only if asked.
