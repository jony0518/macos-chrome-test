// Loads a measurement page in the real Google Chrome on this runner and saves
// whatever the page renders into #out. The page also posts its own result; the
// artifact written here is the reliable copy.
const { chromium } = require('playwright-core');
const fs = require('fs');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const base = process.env.PROBE_URL;
const label = process.env.LABEL || 'macos';
const headless = process.env.HEADLESS !== 'false';

if (!base) {
  console.error('PROBE_URL is required');
  process.exit(2);
}

(async () => {
  const url = base.replace(/\/+$/, '') + '/?p=' + encodeURIComponent(label);
  console.log('mode=' + (headless ? 'headless' : 'headed') + ' url=' + url);

  const browser = await chromium.launch({
    headless,
    executablePath: CHROME,
    args: ['--no-first-run', '--no-default-browser-check'],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });

  // The page fills #out when its measurement completes.
  let text = '';
  for (let i = 0; i < 40; i++) {
    text = await page.evaluate(() => {
      const el = document.getElementById('out');
      return el ? el.textContent : '';
    });
    if (text && text.length > 200) break;
    await page.waitForTimeout(500);
  }

  fs.writeFileSync(label + '.json', text || '{"error":"empty #out"}');
  console.log('captured ' + (text ? text.length : 0) + ' bytes');

  await page.screenshot({ path: label + '.png' }).catch(() => {});
  await browser.close();
})();
