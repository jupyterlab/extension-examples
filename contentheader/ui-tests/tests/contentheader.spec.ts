import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should populate the contentheader', async ({ page }) => {
  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });
  await page.waitForSelector('div[role="main"] >> text=Launcher');

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
});
