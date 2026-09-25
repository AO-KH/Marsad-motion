// Render each rebuilt site page to PNG at natural 1896x1060
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const pages = (process.argv[2] || 'home,pulse,objectTypes,knowledgeMap,links,search,decisions,assistant,projects,admin').split(',');
  const out = path.join(__dirname, 'site_pages'); fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--force-color-profile=srgb', '--hide-scrollbars'] });
  const page = await browser.newPage({ viewport: { width: 1896, height: 1060 } });
  page.on('pageerror', e => console.error('PAGE ERROR:', e.message));
  for (const p of pages) {
    await page.goto('file://' + path.join(__dirname, 'site_pages.html') + '?p=' + p);
    await page.waitForFunction('window.READY===true');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(out, p + '.png') });
  }
  console.log('rendered', pages.length);
  await browser.close();
})();
