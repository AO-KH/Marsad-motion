// Render a Monitor film page to frames with motion blur: each 30 fps frame is the average of S sub-frames spread over
// a 180° shutter (1/60 s), never reaching across a cut. Sub-frames go to <outdir>/sub/, blend.py averages them.
// usage: node films/monitor/render.js <page.html> <outdir> [S=4] [workers=4]
const { chromium } = require(require.resolve('playwright', { paths: [process.cwd(), __dirname + '/../..'] }));
const path = require('path'), fs = require('fs');
const CHROME = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const ROOT = path.join(__dirname, '..', '..');
(async () => {
  const [file, outdir, s = '4', w = '4'] = process.argv.slice(2);
  const S = parseInt(s), WK = parseInt(w), FPS = 30, OPEN = 1 / 60;
  const out = path.resolve(ROOT, outdir), sub = path.join(out, 'sub');
  fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(sub, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--force-color-profile=srgb', '--disable-lcd-text', '--hide-scrollbars'] });
  const t0 = Date.now(); let N = 0, cuts = [];
  await Promise.all([...Array(WK).keys()].map(async k => {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
    page.on('pageerror', e => console.error('PAGE ERROR:', e.message));
    await page.goto('file://' + path.resolve(ROOT, file));
    await page.waitForFunction('typeof window.SEEK === "function"');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
    const [vw, vh, dur, cc] = await page.evaluate(() => [window.STAGE_W, window.STAGE_H, window.DURATION, window.CUTS || []]);
    await page.setViewportSize({ width: vw, height: vh });
    await page.waitForTimeout(300);
    N = Math.round(dur * FPS); cuts = cc;
    for (let i = k; i < N; i += WK) {
      const tc = i / FPS;
      const lo = Math.max(0, ...cuts.filter(c => c <= tc + 1e-6)), hi = Math.min(dur, ...cuts.filter(c => c > tc + 1e-6)) - 1e-4;
      for (let j = 0; j < S; j++) {
        const t = Math.min(hi, Math.max(lo, tc + ((j + 0.5) / S - 0.5) * OPEN));
        await page.evaluate(tt => window.SEEK(tt), t);
        await page.screenshot({ path: path.join(sub, `s_${String(i).padStart(4, '0')}_${j}.jpg`), type: 'jpeg', quality: 97 });
      }
      if (i % 60 === 0) console.log(`frame ${i}/${N} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    }
  }));
  console.log('DONE', N, 'frames x', S, 'in', ((Date.now() - t0) / 1000).toFixed(0), 's');
  await browser.close();
})();
