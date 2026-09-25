// List UI text that the app window's edge slices through while the view holds still (0.4 s or more), and say where
// to move the view so nothing is sliced. Text crossing an edge during a glide is normal and not listed.
// usage: node tools/cutcheck.js <slug> [16x9|9x16|all] [step=0.1]      (after python3 tools/make_demo.py <slug>)
//
// For each hold it prints the time range, the text cut with its edge (L/R/T/B), the view centre in page px, and
// the nearest centre where the top and bottom edges fall between lines of text and the side edges clear every short
// label. Apply it to the focus that sets that view: an absolute centre is app.focus(t, {x:cx, y:cy, w:0, h:0},
// {scale}); or add the difference to dx/dy. A long line running off the side is often fine in 9:16. Titles, labels,
// tabs, buttons, numbers and the step's subject should never be sliced.
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const CHROME = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const ROOT = path.join(__dirname, '..');
const SHORT = 0.45;          // a "short" text (label, tab, number) is narrower than this share of the window
const GAP = 6;               // clearance between text and a window edge, in screen px
const REACH = 150;           // how far (page px) a suggestion may move the view: further would lose the step's subject

// The nearest framing (centre and scale, in page px) where no text line is sliced by the top or bottom edge and no
// short text by a side edge. Works in page coordinates, so other scales can be tried without re-rendering.
function suggest(a) {
  const { F, now } = a, k = (F.right - F.left) / now.ww, fcx = (F.left + F.right) / 2, fcy = (F.top + F.bottom) / 2;
  const toP = (x, c, fc) => c + (x - fc) / (now.s * k);
  const R = a.rects.map(q => [toP(q[0], now.cx, fcx), toP(q[1], now.cy, fcy), toP(q[2], now.cx, fcx), toP(q[3], now.cy, fcy)]);
  const PG = [toP(a.V.left, now.cx, fcx), toP(a.V.top, now.cy, fcy), toP(a.V.right, now.cx, fcx), toP(a.V.bottom, now.cy, fcy)];
  const solve = (c0, lo, hi, half, rects, a0, a1, m) => {   // nearest centre on one axis with clean edges
    if (hi - lo <= 2 * half + 1) return (lo + hi) / 2;         // the page fits: it is centred
    const ok = c => c - half >= lo - 0.01 && c + half <= hi + 0.01 &&
      rects.every(q => [c - half, c + half].every(e => !(q[a0] - m < e && q[a1] + m > e)));
    for (let d = 0; d <= REACH; d += 0.5) for (const c of d ? [c0 - d, c0 + d] : [c0]) if (ok(c)) return c;
    return null;
  };
  const tries = [1, 0.98, 1.02, 0.96, 1.04, 0.94, 1.06, 0.92, 1.08, 0.9, 1.1, 0.88, 1.12, 0.85, 1.15];
  for (const f of tries) {
    const s = now.s * f, hw = now.ww / (2 * s), hh = now.wh / (2 * s), m = GAP / (s * k);
    const cy = solve(now.cy, PG[1], PG[3], hh, R.filter(q => q[2] > now.cx - hw && q[0] < now.cx + hw), 1, 3, m);
    if (cy == null) continue;
    const cx = solve(now.cx, PG[0], PG[2], hw, R.filter(q => q[3] > cy - hh && q[1] < cy + hh && q[2] - q[0] < SHORT * 2 * hw), 0, 2, m);
    if (cx == null) continue;
    return { cx, cy, s };
  }
  return null;
}

(async () => {
  const [slug, want = 'all', st = '0.1'] = process.argv.slice(2);
  if (!slug) { console.error('usage: node tools/cutcheck.js <slug> [16x9|9x16|all] [step]'); process.exit(2); }
  const step = parseFloat(st), MIN = 0.4;
  const fmts = ['16x9', '9x16'].filter(f => want === 'all' || want === f)
    .filter(f => fs.existsSync(path.join(ROOT, 'build', `${slug}-${f}.html`)));
  if (!fmts.length) { console.error(`no build/${slug}-*.html: run python3 tools/make_demo.py ${slug}`); process.exit(2); }
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--force-color-profile=srgb'] });
  for (const f of fmts) {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    page.on('pageerror', e => console.error('PAGE ERROR:', e.message));
    await page.goto('file://' + path.join(ROOT, 'build', `${slug}-${f}.html`));
    await page.waitForFunction('typeof window.SEEK === "function"');
    await page.evaluate(() => document.fonts.ready);
    const [vw, vh, dur] = await page.evaluate(() => [window.STAGE_W, window.STAGE_H, window.DURATION]);
    await page.setViewportSize({ width: vw, height: vh });
    const S = [];
    for (let t = 0; t <= dur + 1e-9; t += step) {
      S.push(await page.evaluate(([tt, SHORT]) => {
        window.SEEK(tt);
        const win = document.querySelector('.m-win'), frame = document.querySelector('.m-frame'), site = document.querySelector('.m-site');
        if (!win || !frame || win.style.display === 'none' || +getComputedStyle(win).opacity < 0.9) return { t: tt, off: true };
        const fr = frame.getBoundingClientRect(), vr = site.getBoundingClientRect();
        const F = { left: fr.left, top: fr.top, right: fr.right, bottom: fr.bottom };
        const op = el => { let o = 1; for (let e = el; e && e !== site; e = e.parentElement) {
          const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; } return o; };
        // the page's full extent (the site box itself is sized 0: use its visible pages)
        let V = { left: 1e9, top: 1e9, right: -1e9, bottom: -1e9 };
        for (const pg of site.querySelectorAll('.m-page')) { if (getComputedStyle(pg).visibility === 'hidden') continue;
          const r = pg.getBoundingClientRect(); V = { left: Math.min(V.left, r.left), top: Math.min(V.top, r.top), right: Math.max(V.right, r.right), bottom: Math.max(V.bottom, r.bottom) }; }
        const cut = [], rects = [], w = document.createTreeWalker(site, NodeFilter.SHOW_TEXT);
        for (let n; (n = w.nextNode());) {
          const s = n.textContent.trim(); if (!s || op(n.parentElement) < 0.25) continue;
          const r = document.createRange(); r.selectNodeContents(n);
          for (const q of r.getClientRects()) {
            if (q.width < 2 || q.height < 2) continue;
            rects.push([q.left, q.top, q.right, q.bottom]);
            const inside = q.right > F.left + 1 && q.left < F.right - 1 && q.bottom > F.top + 1 && q.top < F.bottom - 1;
            const whole = q.left >= F.left - 0.5 && q.right <= F.right + 0.5 && q.top >= F.top - 0.5 && q.bottom <= F.bottom + 0.5;
            if (inside && !whole) {
              const e = [q.left < F.left ? 'L' : '', q.right > F.right ? 'R' : '', q.top < F.top ? 'T' : '', q.bottom > F.bottom ? 'B' : ''].join('');
              const long = !/[TB]/.test(e) && q.width >= SHORT * (F.right - F.left);   // a long line running off the side
              cut.push((long ? '~' : '') + e + ':' + s.slice(0, 32));
            }
          }
        }
        return { t: tt, view: [vr.left, vr.top, vr.width], F, V, rects, now: window.VIEWNOW || null, cut: [...new Set(cut)].sort() };
      }, [t, SHORT]));
    }
    // a hold: consecutive samples where the view stays put (within 2 px: the stage's slow drift is not a move)
    // and the same text is cut
    const same = (a, b) => a.view.every((x, k) => Math.abs(x - b.view[k]) < 2);
    let n = 0, notes = 0;
    for (let i = 0; i < S.length;) {
      const a = S[i];
      if (a.off || !a.cut.length) { i++; continue; }
      let j = i + 1;
      while (j < S.length && !S[j].off && same(S[j], a) && S[j].cut.join('|') === a.cut.join('|')) j++;
      const d = (j - i) * step;
      if (d >= MIN - 1e-9 && a.cut.every(c => c[0] === '~')) {        // only long lines off the side: usually fine
        notes++;
        console.log(`${f}  ${a.t.toFixed(1)}–${(a.t + d).toFixed(1)} s  note: long lines run off the side: ${a.cut.map(c => c.slice(1)).join('  ·  ')}`);
      } else if (d >= MIN - 1e-9) {
        n++;
        console.log(`${f}  ${a.t.toFixed(1)}–${(a.t + d).toFixed(1)} s  ${a.cut.filter(c => c[0] !== '~').join('  ·  ')}`);
        if (a.now) {
          const g = suggest(a), r = x => Math.round(x);
          console.log(`      view centre (${r(a.now.cx)}, ${r(a.now.cy)}) at scale ${a.now.s.toFixed(2)} → ` + (!g ? 'no clean framing nearby: rethink this view'
            : `clean at centre (${r(g.cx)}, ${r(g.cy)})` + (Math.abs(g.s - a.now.s) > 1e-6 ? ` at scale ${g.s.toFixed(2)}` : ' at the same scale')));
        }
      }
      i = j;
    }
    console.log(`${f}: ${n ? n + ' hold(s) with text sliced by the window edge: fix them' : 'clean: no text sliced during holds'}` +
      (notes ? ` (${notes} note(s): long lines running off the side)` : ''));
    await page.close();
  }
  await browser.close();
})();
