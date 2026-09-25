// Render the same timestamps from two HTML versions for side-by-side comparison
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
// Chromium: $CHROMIUM_PATH, else the cloud image's copy, else Playwright's own browser (npx playwright install chromium)
const CHROME = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
(async () => {
  const [file, prefix, tlist] = process.argv.slice(2);
  const ts = tlist.split(',').map(Number);
  const out = path.join(__dirname, 'style_audit'); fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME,
    args: ['--force-color-profile=srgb', '--disable-lcd-text', '--hide-scrollbars'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.error('PAGE ERROR:', e.message));
  await page.goto('file://' + path.join(__dirname, file));
  await page.waitForFunction('typeof window.SEEK === "function"');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
  const [vw, vh] = await page.evaluate(() => [window.STAGE_W || 1920, window.STAGE_H || 1080]);
  if (vw !== 1920 || vh !== 1080) await page.setViewportSize({ width: vw, height: vh });
  await page.waitForTimeout(300);
  for (const t of ts) {
    await page.evaluate(tt => window.SEEK(tt), t);
    await page.waitForTimeout(80);
    await page.screenshot({ path: path.join(out, `${prefix}_${t.toFixed(3)}.png`) });
  }
  console.log(prefix, 'rendered', ts.length);
  await browser.close();
})();
