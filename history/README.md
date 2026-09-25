# history — how film.html was produced (reference only)

`../film.html` is the master source now; edit it directly. These files are the patch chain that
built it, kept so the logic of each pass can be read in isolation. They are not meant to be re-run
(each script reads the previous pass's output with exact-string replacements).

Order: `film_dark_original.html` (first dark cut) → `build_film_site.py` (light site edition, uses
`film_site_head.html`, `film_site_body.html`, `fs_parts/ui_build.js, s5_build.js, canvases.js, scene5.js,
sceneUI.js, scene9.js, scene10.js`) → `build_glow.py` (purple glow, `glow_style.css`,
`fs_parts/glow_canvases.js`) → `build_tr.py` (beat-locked camera transitions, `fs_parts/transitions.js,
tr_canvases.js`) → `build_final.py` (kickers removed, bigger M) → `build_final2.py` (ignition burst,
`fs_parts/ignition.js`) → `build_final3.py` (charge-up, `fs_parts/charge.js`) → `build_final4.py`
(rhythm lock, `fs_parts/rhythm_scenes.js`) → `build_final5.py` (decelerate entrances) →
`build_final6.py` (all beat pulsing removed) = `../film.html`.

`stems_tr.py` / `stems_ig.py` are the two audio passes before the current `../audio_stems.py`.
`fs_parts/sfx_rhythm.py` and `fs_parts/vo_rhythm.py` are the SFX score / voice placement blocks that
were spliced into `../audio_stems.py`. `style_v1.css` is the abandoned dark-glass style pass.
