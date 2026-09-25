// Render a film page to JPEG frames (length from window.DURATION), split across W parallel pages
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
// Chromium: $CHROMIUM_PATH, else the cloud image's copy, else Playwright's own browser (npx playwright install chromium)
const CHROME = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
(async () => {
  const W = parseInt(process.argv[2] || '4'), FPS = 30;
  const FILE = process.argv[3] || 'film_styled.html', OUT = process.argv[4] || 'frames_styled';
  const out = path.join(__dirname, OUT); fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME,
    args: ['--force-color-profile=srgb', '--disable-lcd-text', '--hide-scrollbars'] });
  const t0 = Date.now();
  const F0 = parseInt(process.argv[5] || '0'); let N = 0;
  await Promise.all([...Array(W).keys()].map(async w => {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    page.on('pageerror', e => console.error('PAGE ERROR:', e.message));
    await page.goto('file://' + path.join(__dirname, FILE));
    await page.waitForFunction('typeof window.SEEK === "function"');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
    await page.waitForTimeout(300);
    N = Math.round(await page.evaluate(() => window.DURATION) * FPS);      // film length comes from the page
    const F1 = parseInt(process.argv[6] || String(N));
    for (let i = F0 + w; i < F1; i += W) {
      await page.evaluate(tt => window.SEEK(tt), i / FPS);
      await page.screenshot({ path: path.join(out, `f_${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 95 });
      if (i % 300 === 0) console.log(`frame ${i}/${N} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    }
  }));
  console.log('DONE', N, 'frames in', ((Date.now() - t0) / 1000).toFixed(0), 's');
  await browser.close();
})();
