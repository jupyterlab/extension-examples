import { test, expect } from '@jupyterlab/galata';

test('should populate the contentheader', async ({ page }) => {
  // Click text=View
  await page.click('text=View');
  // Click text=Activate Command Palette
  await page.click('text=Activate Command Palette');
  // Fill [aria-label="Command Palette Section"] [placeholder="SEARCH"]
  await page.fill(
    '[aria-label="Command Palette Section"] [placeholder="SEARCH"]',
    'populate content header'
  );
  // Click text=... (from index.ts, `command` -> `label`)
  await page.click('text=Populate content header (time example)');

  // Ensure we see text from the extension example
  expect(await page.waitForSelector('text=Time in GMT is:')).toBeTruthy();

  // Ensure that launcher was not overwritten
  expect(await page.waitForSelector('.jp-Launcher-content')).toBeTruthy();
});
