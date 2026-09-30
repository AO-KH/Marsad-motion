"""Assemble a demo into renderable pages: demos/<slug>/ -> build/<slug>-16x9.html and build/<slug>-9x16.html.

usage: python3 tools/make_demo.py <slug>              write the pages
       python3 tools/make_demo.py <slug> --formats    print the formats listed in demo.json (used by build_demo.sh)

A demo folder holds:
  demo.json   title, duration (s), formats, music {file, bpm, downbeat, start, loop, fade_in, fade_out}
  demo.js     the timeline, written against the engine API (engine/engine.js); ends with M.start()
  demo.css    optional extra styles        pages.js  optional custom pages (M.definePage)
  app/        optional: the real app's screens, frozen by tools/app_snap.js (app/pages.js and app/app.css are loaded
              before the demo's own pages.js and demo.css)
  "kit": "walk" in demo.json loads a kit from demos/kit/ (walk.js and walk.css) between the engine and demo.js: the
  walkthrough method (M.walk; see demos/kit/walk.js)
Campaign films use the same engine and tools: films/<slug>/ holds film.json, film.js, film.css and pages.js (the
same roles), and film.json may add "vo" and "sfx" (tools/film_audio.py mixes them). <slug> is looked up in demos/
first, then films/.
The page gets window.DEMO = {slug, title, format, duration, bpm, phase}; phase is the video time of the first
downbeat, so M.B(0) is a downbeat and M.B(4k) are bar lines.
"""
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FORMATS = ('16x9', '9x16')


def folder(slug):
    """demos/<slug> (product demos) or films/<slug> (campaign films)."""
    for base in ('demos', 'films'):
        d = os.path.join(ROOT, base, slug)
        if os.path.isdir(d):
            return d
    sys.exit(f'no folder demos/{slug} or films/{slug}')


def part(d, ext):
    """a folder's demo.<ext> or film.<ext> (json, js, css), or None."""
    for stem in ('demo', 'film'):
        f = os.path.join(d, f'{stem}.{ext}')
        if os.path.isfile(f):
            return f
    return None


def load(slug):
    d = folder(slug)
    rel = os.path.relpath(d, ROOT)
    if not part(d, 'json'):
        sys.exit(f'{rel}/demo.json (or film.json) is missing')
    with open(part(d, 'json'), encoding='utf-8') as f:
        meta = json.load(f)
    if not part(d, 'js'):
        sys.exit(f'{rel}/demo.js (or film.js) is missing')
    fmts = meta.get('formats', list(FORMATS))
    bad = [f for f in fmts if f not in FORMATS]
    if bad:
        sys.exit(f'unknown format(s) {bad}; use {FORMATS}')
    return d, meta, fmts


def grid(meta):
    """bpm and the video time of the first downbeat (both None without music)."""
    m = meta.get('music') or {}
    if not m.get('bpm'):
        return None, 0.0
    bpm = float(m['bpm'])
    bar = 4 * 60.0 / bpm
    if m.get('edit'):                                              # the film starts on beat a of the first section
        return bpm, round(((-float(m['edit'][0][0])) % 4) * 60.0 / bpm, 5)
    phase = (float(m.get('downbeat', 0.0)) - float(m.get('start', 0.0))) % bar
    if bar - phase < 0.02:                                        # start sits a hair after a downbeat (rounding)
        good = float(m.get('start', 0.0)) - (bar - phase)
        print(f'warning: "start" {m.get("start")} is {1000 * (bar - phase):.0f} ms after a downbeat, so M.B(0) lands a bar '
              f'later ({phase:.3f} s). Use "start": {good:.3f}', file=sys.stderr)
    return bpm, round(phase, 5)


def page(slug, d, meta, fmt):
    bpm, phase = grid(meta)
    demo = {'slug': slug, 'title': meta.get('title', slug), 'format': fmt,
            'duration': float(meta['duration']), 'bpm': bpm, 'phase': phase}
    rel = os.path.relpath(d, ROOT).replace(os.sep, '/')
    css, js = part(d, 'css'), part(d, 'js')
    film = rel.startswith('films/')                # films also get the film kit (films/kit/: brand tiles, mark, statements)
    extra_css = ('<link rel="stylesheet" href="films/kit/kit.css">\n' if film else '') + \
                (f'<link rel="stylesheet" href="{rel}/{os.path.basename(css)}">\n' if css else '')
    pages_js = f'<script src="{rel}/pages.js"></script>\n' if os.path.isfile(os.path.join(d, 'pages.js')) else ''
    if os.path.isfile(os.path.join(d, 'app', 'pages.js')):         # the real app's screens (tools/app_snap.js)
        pages_js = f'<script src="{rel}/app/pages.js"></script>\n' + pages_js
    if os.path.isfile(os.path.join(d, 'app', 'app.css')):
        extra_css = f'<link rel="stylesheet" href="{rel}/app/app.css">\n' + extra_css
    kit = meta.get('kit')                          # a demo kit: demos/kit/<kit>.js (+ .css), e.g. the walkthrough method
    if kit:
        if not os.path.isfile(os.path.join(ROOT, 'demos', 'kit', f'{kit}.js')):
            sys.exit(f'no demos/kit/{kit}.js (the "kit" in {rel}/demo.json)')
        if os.path.isfile(os.path.join(ROOT, 'demos', 'kit', f'{kit}.css')):
            extra_css = f'<link rel="stylesheet" href="demos/kit/{kit}.css">\n' + extra_css
        pages_js = f'<script src="demos/kit/{kit}.js"></script>\n' + pages_js
    return f'''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<base href="../">
<title>{demo['title']} — {fmt}</title>
<link rel="stylesheet" href="site_kit.css">
<link rel="stylesheet" href="engine/engine.css">
{extra_css}</head>
<body>
<!-- generated by tools/make_demo.py from {rel}/ — edit that folder, then rebuild -->
<script>window.DEMO={json.dumps(demo, ensure_ascii=False)};</script>
<script src="site_kit.js"></script>
<script src="engine/engine.js"></script>
{'<script src="films/kit/kit.js"></script>' + chr(10) if film else ''}{pages_js}<script src="{rel}/{os.path.basename(js)}"></script>
</body>
</html>
'''


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    slug = sys.argv[1]
    d, meta, fmts = load(slug)
    if '--formats' in sys.argv:
        print(' '.join(fmts))
        return
    os.makedirs(os.path.join(ROOT, 'build'), exist_ok=True)
    for fmt in fmts:
        out = os.path.join(ROOT, 'build', f'{slug}-{fmt}.html')
        with open(out, 'w', encoding='utf-8') as f:
            f.write(page(slug, d, meta, fmt))
        print('wrote', os.path.relpath(out, ROOT))


if __name__ == '__main__':
    main()
