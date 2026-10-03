'use strict';
// Regression for the four chooser inputs that formerly caused an uncaught
// error. Uses an existing Playwright/Chromium installation; downloads nothing.
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);
function option(name) {
  const i = args.indexOf(name);
  if (i < 0) return undefined;
  assert(args[i + 1], name + ' needs a value'); return args[i + 1];
}
if (args.includes('--help')) {
  console.log('node checks/browser.js [--url http://127.0.0.1:8000/c64/jumpman/] [--playwright /path/to/playwright] [--chromium /path/to/chromium] [--report result.json]');
  process.exit(0);
}
const {chromium} = require(option('--playwright') || 'playwright');
(async () => {
  const browser = await chromium.launch({headless: true, executablePath: option('--chromium')});
  try {
    const page = await browser.newPage(), errors = [], http = [], cases = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) http.push({url: r.url(), status: r.status()}); });
    await page.goto(option('--url') || 'http://127.0.0.1:8000/c64/jumpman/');
    const field = page.locator('#jm-rng-seed'), choose = page.locator('#jm-rng-next'), output = page.locator('#jm-rng-result');
    for (const width of [1440, 390]) {
      await page.setViewportSize({width, height: 900});
      for (const seed of ['0000', '4000', '8000', 'C000']) {
        // Select a real result first, so stale highlighting is also tested.
        await field.fill('1F27'); await choose.click();
        assert.match(await output.innerText(), /PLF01/);
        await field.fill(seed); await choose.click();
        const text = await output.innerText();
        assert.match(text, /retries 00 forever/);
        assert.match(text, /No file is chosen/);
        assert.equal(await field.inputValue(), '0000');
        assert.equal(await page.locator('#jm-rng-grid .jm-selected').count(), 0);
        cases.push({width, seed, result: text});
      }
      for (const [seed, expected] of [['0002', 'PLF01'], ['1F27', 'PLF01'], ['E9A7', 'PLF25']]) {
        await field.fill(seed); await choose.click(); assert((await output.innerText()).includes(expected));
      }
      for (const invalid of ['', 'zzzz']) {
        await field.fill(invalid); await choose.click(); assert.match(await output.innerText(), /hexadecimal digits/);
      }
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
    }
    assert.deepEqual(errors, []); assert.deepEqual(http, []);
    const result = {passed: true, cases, successfulInputsPerWidth: 3, invalidInputsPerWidth: 2, errors, http};
    if (option('--report')) fs.writeFileSync(path.resolve(option('--report')), JSON.stringify(result, null, 2) + '\n');
    console.log('PASS: all four stalled seeds, recovery to successful selection, invalid input and desktop/mobile layout.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
