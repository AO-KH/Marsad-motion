// Capture the real Marsad web app's screens for a demo: run the client's front end with sample data, drive it through the
// states the demo needs, and freeze each one into static HTML + CSS. The engine then animates those pages like its own
// (zoom, float, type, count): real DOM, so the app's own text and layout, sharp at any zoom.
//
// usage: node tools/app_snap.js <slug> [--url http://localhost:3000] [--fe <path to marsad-frontend>]
//   --url  where the front end runs (default http://localhost:3000)
//   --fe   the front end's folder (the client's zip, unpacked). If nothing answers at --url, the tool starts its dev
//          server there (and runs npm ci first if node_modules is missing). The server keeps running for re-runs.
// Needs: npm install (the icon font comes from the material-symbols package) and pip install fonttools brotli.
//
// It reads demos/<slug>/app/capture.js:
//   module.exports = {
//     viewport: {width: 1440, height: 805},   // the browser window (1440 x 805 has the demo window's 16:9 shape)
//     theme: 'dark',                           // optional: the app's dark mode (the product team films in it); default light
//     routes: [[method, /path/, body | (reqBody, path) => body], ...],   // the sample data; first match wins (tools/app/env.js
//                                                                        // answers sign-in, org, workspace, rights, the bell)
//     states: [{key, url, run: async page => {...}, tag: {name: page => locator}, wait}, ...],
//   };
// States run in order in one tab, each from where the last left off (a url opens a page first). `run` drives the app with
// Playwright (click, fill, scroll); `tag` marks elements with data-w="name" so demo.js can aim at '[data-w=name]'.
//
// It writes demos/<slug>/app/: pages.js (M.definePage(key, {app: true, ...}) per state; make_demo.py loads it),
// app.css (the fonts and the app's rules, scoped to .rx-scope), icons.woff2 (only the icons the screens use); and
// build/<slug>-app/: <key>.png (the live app), <key>.snap.png (the snapshot drawn alone, through the engine's CSS),
// <key>.diff.png (red where they differ). It prints the share of pixels that differ per state: over 0.5% needs a look.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), http = require('http'), { spawn, execFileSync } = require('child_process');
const { setup, fontCss, ICONS_FULL, ROOT } = require('./app/env.js');
const serialize = require('./app/serialize.js');
const CHROME = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);

const args = process.argv.slice(2), slug = args[0];
const opt = k => { const i = args.indexOf('--' + k); return i > 0 ? args[i + 1] : null; };
if (!slug) { console.error('usage: node tools/app_snap.js <slug> [--url http://localhost:3000] [--fe <marsad-frontend>]'); process.exit(1); }
const BASE = (opt('url') || 'http://localhost:3000').replace(/\/$/, '');
const DIR = path.join(ROOT, 'demos', slug, 'app'), OUT = path.join(ROOT, 'build', `${slug}-app`);
const SPEC = path.join(DIR, 'capture.js');
if (!fs.existsSync(SPEC)) { console.error(`no demos/${slug}/app/capture.js (see the header of tools/app_snap.js)`); process.exit(1); }
if (!fs.existsSync(path.join(ROOT, ICONS_FULL))) { console.error(`no ${ICONS_FULL}: run npm install`); process.exit(1); }
const spec = require(SPEC);
fs.mkdirSync(OUT, { recursive: true });

const up = () => new Promise(res => { const r = http.get(BASE, x => { x.resume(); res(true); }); r.on('error', () => res(false)); r.setTimeout(4000, () => { r.destroy(); res(false); }); });
async function server() {
  if (await up()) return;
  const fe = opt('fe');
  if (!fe) { console.error(`nothing answers at ${BASE}: start the front end (cd <marsad-frontend>/apps/web && npx next dev --port 3000) or pass --fe <marsad-frontend>`); process.exit(1); }
  if (!fs.existsSync(path.join(fe, 'node_modules'))) { console.log('npm ci in', fe, '(a few minutes)'); execFileSync('npm', ['ci', '--no-audit', '--no-fund'], { cwd: fe, stdio: 'inherit' }); }
  const port = new URL(BASE).port || '3000', log = fs.openSync(path.join(OUT, 'next-dev.log'), 'a');
  console.log(`starting the front end's dev server on :${port} (log: build/${slug}-app/next-dev.log)`);
  spawn('npx', ['next', 'dev', '--port', port], { cwd: path.join(fe, 'apps', 'web'), detached: true, stdio: ['ignore', log, log] }).unref();
  for (let i = 0; i < 150; i++) { if (await up()) return; await new Promise(r => setTimeout(r, 2000)); }
  console.error('the dev server did not answer in 5 minutes'); process.exit(1);
}

// the page as the engine builds it (engine.js page(): the .m-page.rx-page box; engine.css resets .rx-scope)
const wrap = s => `<div class="rx-scope"${s.scroll[0] || s.scroll[1] ? ` data-rx-scroll="${s.scroll[0]},${s.scroll[1]}"` : ''}>` +
  `<div class="rx-html${s.htmlCls ? ' ' + s.htmlCls : ''}" dir="${s.dir}"${s.lang ? ` lang="${s.lang}"` : ''}>` +
  `<div class="rx-body${s.bodyCls ? ' ' + s.bodyCls : ''}">${s.html}</div></div></div>`;
const SCROLL = `for(const n of document.querySelectorAll('[data-rx-scroll]')){const [x,y]=n.dataset.rxScroll.split(',');n.scrollLeft=+x;n.scrollTop=+y;}`;

(async () => {
  await server();
  const vp = spec.viewport || { width: 1440, height: 805 };
  const browser = await chromium.launch({ executablePath: CHROME });
  const ctx = await browser.newContext({ viewport: vp, locale: 'ar', colorScheme: 'light' });
  const log = [];
  await setup(ctx, { routes: spec.routes, log, theme: spec.theme || 'light', lang: spec.lang || 'ar' });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('  app error:', e.message.slice(0, 160)));
  const snaps = [];
  for (const st of spec.states) {
    if (st.url) await page.goto(BASE + st.url, { waitUntil: 'networkidle', timeout: 240000 });
    if (st.run) await st.run(page);
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(st.wait ?? 600);
    for (const [name, fn] of Object.entries(st.tag || {})) {
      const loc = fn(page), n = await loc.count();
      if (!n) throw new Error(`state "${st.key}": nothing to tag as "${name}"`);
      await loc.first().evaluate((e, v) => e.setAttribute('data-w', v), name);
    }
    await page.screenshot({ path: path.join(OUT, `${st.key}.png`) });
    const s = await page.evaluate(serialize);
    s.notes.forEach(n => console.log(`  ${st.key}: ${n}`));
    snaps.push({ key: st.key, ...s });
    console.log(`captured ${st.key} (${page.url().replace(BASE, '')}): ${(s.html.length / 1024).toFixed(0)} KB of HTML, ${s.icons.length} icons`);
  }
  const fresh = [...new Set(log)].filter(l => l.startsWith('NEW'));
  if (fresh.length) console.log('calls with no sample data (answered {}):\n  ' + fresh.join('\n  '));

  /* the CSS: the fonts (paths from demos/<slug>/app/), then the app's rules (the union over the states, in order) */
  const rules = [], seen = new Set();
  for (const s of snaps) for (const r of s.rules) if (!seen.has(r)) { seen.add(r); rules.push(r); }
  const icons = [...new Set(snaps.flatMap(s => s.icons))].sort();
  execFileSync('python3', [path.join(ROOT, 'tools', 'subset_icons.py'), path.join(ROOT, ICONS_FULL), path.join(DIR, 'icons.woff2'), ...icons], { stdio: 'inherit' });
  const css = `/* generated by tools/app_snap.js from demos/${slug}/app/capture.js: the real app's styles, frozen at ${vp.width} x ${vp.height}.\n` +
    `   Do not edit: re-run the tool. The rules only apply inside .rx-scope (a captured page; engine.css resets it).\n` +
    `   Fonts: IBM Plex Sans Arabic and Noto Kufi Arabic (SIL OFL 1.1, fonts/); icons.woff2 is Material Symbols Outlined\n` +
    `   (Google, Apache License 2.0), cut down to the icons these screens use by tools/subset_icons.py. */\n` +
    fontCss(f => f === ICONS_FULL ? 'icons.woff2' : '../../../' + f) +
    '\n@scope (.rx-scope) {\n*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important;}\n' +
    '[data-rx-field=area] .m-typed{white-space:pre-wrap;}\n' + rules.join('\n') + '\n}\n';
  fs.writeFileSync(path.join(DIR, 'app.css'), css);
  const js = `/* generated by tools/app_snap.js from demos/${slug}/app/capture.js: the real app's screens (the client's front end\n` +
    `   with this demo's sample data), one page per state. Do not edit: re-run the tool. */\n` +
    snaps.map(s => `M.definePage(${JSON.stringify(s.key)},{app:true,w:${s.w},h:${s.h},html:${JSON.stringify(wrap(s))}});`).join('\n') + '\n';
  fs.writeFileSync(path.join(DIR, 'pages.js'), js);
  console.log(`wrote demos/${slug}/app/pages.js (${(js.length / 1024).toFixed(0)} KB), app.css (${(css.length / 1024).toFixed(0)} KB, ${rules.length} rules), icons.woff2`);

  /* the check: each snapshot drawn alone through the engine's CSS, against the live screenshot */
  const cp = await (await browser.newContext({ viewport: vp })).newPage();
  const diffPage = await (await browser.newContext({ viewport: { width: 200, height: 200 } })).newPage();
  const ROOTURL = 'file://' + ROOT + '/';
  for (const s of snaps) {
    const f = path.join(OUT, `${s.key}.check.html`);
    fs.writeFileSync(f, `<!DOCTYPE html><html><head><meta charset="utf-8"><base href="${ROOTURL}"><link rel="stylesheet" href="site_kit.css">` +
      `<link rel="stylesheet" href="engine/engine.css"><link rel="stylesheet" href="demos/${slug}/app/app.css"></head><body>` +
      `<div class="site m-site"><div class="m-page rx-page" style="width:${s.w}px;height:${s.h}px">${wrap(s)}</div></div></body></html>`);
    await cp.goto('file://' + f);
    await cp.evaluate(() => document.fonts.ready);
    await cp.evaluate(SCROLL);
    await cp.waitForTimeout(150);
    await cp.screenshot({ path: path.join(OUT, `${s.key}.snap.png`) });
    const b64 = n => 'data:image/png;base64,' + fs.readFileSync(path.join(OUT, n)).toString('base64');
    const d = await diffPage.evaluate(async ([a, b]) => {
      const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
      const [A, B] = await Promise.all([load(a), load(b)]);
      const c = document.createElement('canvas'); c.width = A.width; c.height = A.height; const g = c.getContext('2d');
      g.drawImage(A, 0, 0); const da = g.getImageData(0, 0, c.width, c.height).data;
      g.clearRect(0, 0, c.width, c.height); g.drawImage(B, 0, 0); const db = g.getImageData(0, 0, c.width, c.height).data;
      const o = g.createImageData(c.width, c.height); let n = 0;
      for (let i = 0; i < da.length; i += 4) {
        const dd = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2]));
        const v = 185 + (da[i] + da[i + 1] + da[i + 2]) / 12;
        if (dd > 48) { n++; o.data[i] = 235; o.data[i + 1] = 20; o.data[i + 2] = 70; } else { o.data[i] = o.data[i + 1] = o.data[i + 2] = v; }
        o.data[i + 3] = 255;
      }
      g.putImageData(o, 0, 0);
      return { n, total: da.length / 4, png: c.toDataURL('image/png') };
    }, [b64(`${s.key}.png`), b64(`${s.key}.snap.png`)]);
    fs.writeFileSync(path.join(OUT, `${s.key}.diff.png`), Buffer.from(d.png.split(',')[1], 'base64'));
    const pc = 100 * d.n / d.total;
    console.log(`check ${s.key}: ${pc.toFixed(2)}% of pixels differ${pc > 0.5 ? `  <- look at build/${slug}-app/${s.key}.diff.png` : ''}`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
