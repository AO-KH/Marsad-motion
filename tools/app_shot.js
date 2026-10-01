// Screenshots of the real Marsad web app for a campaign film: run the client's front end with sample data, drive it
// through the states the film needs, and save each one as a sharp PNG (and crops of its parts), for the film to place
// in 3D. A campaign film shows pages as images (the marsad-campaign skill); a walkthrough uses tools/app_snap.js instead.
//
// usage: node tools/app_shot.js <slug> [--url http://localhost:3000] [--fe <path to marsad-frontend>]
//   The same front end and options as tools/app_snap.js (it starts the dev server with --fe when nothing answers).
//
// It reads films/<slug>/app/capture.js (or demos/<slug>/app/capture.js), app_snap's format plus two keys:
//   module.exports = {
//     viewport: {width: 1440, height: 805}, theme: 'dark', routes: [...],      // as in app_snap
//     dpr: 5,                                    // the pixel ratio of the PNGs (5: a 1440 px page is 7200 px wide, sharp in 4K close-ups)
//     states: [{key, url, run, wait, crops: {name: page => locator}}, ...],    // crops: parts saved on their own
//   };
// It writes films/<slug>/pages/: <key>.png (the whole window), <key>-<name>.png (each crop, at the same pixel ratio) and
// shots.json (each crop's box in CSS px, {key: {name: {x, y, w, h}}}, so the film can lift a part off its page exactly).
// CSS transitions and animations are switched off, so each still is the settled state.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), http = require('http'), { spawn, execFileSync } = require('child_process');
const { setup, ROOT } = require('./app/env.js');
const CHROME = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);

const args = process.argv.slice(2), slug = args[0];
const opt = k => { const i = args.indexOf('--' + k); return i > 0 ? args[i + 1] : null; };
if (!slug) { console.error('usage: node tools/app_shot.js <slug> [--url http://localhost:3000] [--fe <marsad-frontend>]'); process.exit(1); }
const BASE = (opt('url') || 'http://localhost:3000').replace(/\/$/, '');
const HOME = ['films', 'demos'].map(b => path.join(ROOT, b, slug)).find(d => fs.existsSync(path.join(d, 'app', 'capture.js')));
if (!HOME) { console.error(`no films/${slug}/app/capture.js (see the header of tools/app_shot.js)`); process.exit(1); }
const spec = require(path.join(HOME, 'app', 'capture.js'));
const OUT = path.join(HOME, 'pages'); fs.mkdirSync(OUT, { recursive: true });

const up = () => new Promise(res => { const r = http.get(BASE, x => { x.resume(); res(true); }); r.on('error', () => res(false)); r.setTimeout(4000, () => { r.destroy(); res(false); }); });
async function server() {
  if (await up()) return;
  const fe = opt('fe');
  if (!fe) { console.error(`nothing answers at ${BASE}: start the front end or pass --fe <marsad-frontend>`); process.exit(1); }
  if (!fs.existsSync(path.join(fe, 'node_modules'))) { console.log('npm ci in', fe, '(a few minutes)'); execFileSync('npm', ['ci', '--no-audit', '--no-fund'], { cwd: fe, stdio: 'inherit' }); }
  const port = new URL(BASE).port || '3000', log = fs.openSync(path.join(ROOT, 'build', `${slug}-next-dev.log`), 'a');
  console.log(`starting the front end's dev server on :${port}`);
  spawn('npx', ['next', 'dev', '--port', port], { cwd: path.join(fe, 'apps', 'web'), detached: true, stdio: ['ignore', log, log] }).unref();
  for (let i = 0; i < 150; i++) { if (await up()) return; await new Promise(r => setTimeout(r, 2000)); }
  console.error('the dev server did not answer in 5 minutes'); process.exit(1);
}

(async () => {
  fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
  await server();
  const vp = spec.viewport || { width: 1440, height: 805 }, dpr = spec.dpr || 5;
  const browser = await chromium.launch({ executablePath: CHROME });
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: dpr, locale: 'ar', colorScheme: spec.theme === 'dark' ? 'dark' : 'light' });
  const log = [];
  await setup(ctx, { routes: spec.routes, log, theme: spec.theme || 'light' });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('  app error:', e.message.slice(0, 160)));
  const boxes = {};
  const still = async () => {
    await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
  };
  for (const s of spec.states) {
    if (s.url) await page.goto(BASE + s.url, { waitUntil: 'networkidle' });
    if (s.run) await s.run(page);
    if (typeof s.wait === 'function') await s.wait(page); else if (s.wait) await page.waitForTimeout(s.wait);
    await still();
    await page.screenshot({ path: path.join(OUT, `${s.key}.png`) });
    const made = [`${s.key}.png`];
    for (const [name, fn] of Object.entries(s.crops || {})) {
      const loc = fn(page).first();
      const b = await loc.boundingBox();
      if (!b) { console.log(`  ${s.key}: crop ${name} not found`); continue; }
      (boxes[s.key] = boxes[s.key] || {})[name] = { x: +b.x.toFixed(1), y: +b.y.toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1) };
      await page.screenshot({ path: path.join(OUT, `${s.key}-${name}.png`), clip: b });
      made.push(`${s.key}-${name}.png`);
    }
    console.log(`${s.key}: ${made.join(', ')}`);
  }
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify({ viewport: vp, dpr, boxes }, null, 1));
  const fresh = [...new Set(log.filter(l => l.startsWith('NEW')))];
  if (fresh.length) console.log('calls with no sample data (answered {}):\n  ' + fresh.join('\n  '));
  await browser.close();
})();
