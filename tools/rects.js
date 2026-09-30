// Where things are on a demo's pages, in natural page px (the 1896x1060 site-kit space the camera and app.focus use):
// aim the walkthrough camera (W.cam(t, {at: W.NP(x, y)})) and pick zooms from these.
// usage: node tools/rects.js <slug> '<selector>' 'text:…' ...      (run python3 tools/make_demo.py <slug> first)
// Every page the demo opens (M.app's page, app.page) is searched; a 'text:' target is the smallest element holding the text,
// and a wrapper holding just one element with the same text gives way to that element (as W.lift does).
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const CHROME = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
(async () => {
  const [slug, ...sels] = process.argv.slice(2);
  if (!slug || !sels.length) { console.error("usage: node tools/rects.js <slug> '<selector>' 'text:…' ..."); process.exit(1); }
  const file = path.join(__dirname, '..', 'build', `${slug}-16x9.html`);
  if (!fs.existsSync(file)) { console.error(`no ${path.relative(process.cwd(), file)}: run python3 tools/make_demo.py ${slug}`); process.exit(1); }
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.error('PAGE ERROR:', e.message));
  await page.goto('file://' + file);
  await page.waitForFunction('typeof window.SEEK === "function"');
  await page.evaluate(() => document.fonts.ready);
  const out = await page.evaluate((sels) => {
    const pages = [...document.querySelectorAll('.m-page:not(.m-chrome)')], chrome = document.querySelector('.m-chrome');
    const rect = e => { const root = e.closest('.m-page'); let x = 0, y = 0, n = e; while (n && n !== root) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
      return [x, y, e.offsetWidth, e.offsetHeight].map(Math.round); };
    return sels.map(s => {
      const hits = [];
      for (const r of pages.concat(chrome ? [chrome] : [])) {
        let e = null;
        if (s.startsWith('text:')) { const q = s.slice(5); for (const c of r.querySelectorAll('*')) { const tx = c.textContent; if (tx && tx.includes(q) && (!e || tx.length < e.textContent.length)) e = c; } }
        else e = r.querySelector(s);
        if (!e) continue;
        while (e.children.length === 1 && e.children[0].textContent === e.textContent) e = e.children[0];
        const fixes = []; for (let a = e; a && a !== document.body; a = a.parentElement) if (getComputedStyle(a).display === 'none') { fixes.push([a, a.style.display]); a.style.display = 'block'; }
        const [x, y, w, h] = rect(e); fixes.forEach(([a, d]) => a.style.display = d);
        hits.push({ page: r === chrome ? 'top bar' : (r.dataset.key || '?'), x, y, w, h, cx: Math.round(x + w / 2), cy: Math.round(y + h / 2) });
      }
      return [s, hits];
    });
  }, sels);
  for (const [s, hits] of out) {
    if (!hits.length) { console.log(`${s}: not found`); continue; }
    for (const r of hits) { const z = 0.8 * 1920 / (r.w * 0.717);   // the zoom at which it fills 80% of the frame's width
      console.log(`${s.padEnd(34)} ${r.page.padEnd(10)} x ${r.x}, y ${r.y}, ${r.w} x ${r.h}   centre NP(${r.cx},${r.cy})   ` +
        (z <= 4.5 ? `fills 80% of the width at z ${z.toFixed(2)}` : 'small: frame it at z 3.5-4.2, with its neighbours')); }
  }
  await browser.close();
})();
