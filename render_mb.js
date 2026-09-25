// Render a film or demo page with motion blur: each 30 fps frame is S sub-frames spread over a 180° shutter (1/60 s),
// written to <outdir>/sub/; then `python3 tools/blend.py <outdir>` averages them into <outdir>/f_%04d.jpg.
// A page that cuts sets window.CUTS (times of its hard cuts); sub-frames never reach across one, so cuts stay clean.
// Length from window.DURATION, size from window.STAGE_W/H.  usage: node render_mb.js <workers> <page.html> <outdir> [S=4]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const CHROME = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
(async () => {
  const [w = '4', file, outdir, s = '4'] = process.argv.slice(2);
  const WK = parseInt(w), S = parseInt(s), FPS = 30, OPEN = 1 / 60;
  const out = path.join(__dirname, outdir), sub = path.join(out, 'sub');
  fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(sub, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--force-color-profile=srgb', '--disable-lcd-text', '--hide-scrollbars'] });
  const t0 = Date.now(); let N = 0;
  await Promise.all([...Array(WK).keys()].map(async k => {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    page.on('pageerror', e => console.error('PAGE ERROR:', e.message));
    await page.goto('file://' + path.join(__dirname, file));
    await page.waitForFunction('typeof window.SEEK === "function"');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
    const [vw, vh, dur, cuts] = await page.evaluate(() => [window.STAGE_W || 1920, window.STAGE_H || 1080, window.DURATION, window.CUTS || []]);
    if (vw !== 1920 || vh !== 1080) await page.setViewportSize({ width: vw, height: vh });
    await page.waitForTimeout(300);
    N = Math.round(dur * FPS);
    for (let i = k; i < N; i += WK) {
      const tc = i / FPS;
      const lo = Math.max(0, ...cuts.filter(c => c <= tc + 1e-6)), hi = Math.min(dur, ...cuts.filter(c => c > tc + 1e-6)) - 1e-4;
      for (let j = 0; j < S; j++) {
        const t = S > 1 ? Math.min(hi, Math.max(lo, tc + ((j + 0.5) / S - 0.5) * OPEN)) : tc;
        await page.evaluate(tt => window.SEEK(tt), t);
        await page.screenshot({ path: path.join(sub, `s_${String(i).padStart(4, '0')}_${j}.jpg`), type: 'jpeg', quality: 97 });
      }
      if (i % 300 === 0) console.log(`frame ${i}/${N} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    }
  }));
  console.log('DONE', N, 'frames x', S, 'in', ((Date.now() - t0) / 1000).toFixed(0), 's');
  await browser.close();
})();
