import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should open a notebook and use the completer', async ({ page }) => {
  // Go to http://localhost:8888/lab?
  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });
  await page.waitForSelector('div[role="main"] >> text=Launcher');

  // Click text=File
  await page.click('text=File');

  // Click ul[role="menu"] >> text=New
  await page.click('ul[role="menu"] >> text=New');

  // Click #jp-mainmenu-file-new >> text=Notebook
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8888/lab/tree/Untitled.ipynb' }*/),
    page.click('#jp-mainmenu-file-new >> text=Notebook'),
  ]);

  // Click button:has-text("Select")
  await page.click('button:has-text("Select")');

  // Wait until kernel is ready
  await page.waitForSelector(
    '#jp-main-statusbar >> text=Python 3 (ipykernel) | Idle'
  );

  // Click div[role="presentation"]:has-text("​")
  await page.click('div[role="presentation"]:has-text("​")');

  // Fill textarea
  await page.fill('textarea', 'y');

  let suggestions = null;
  let counter = 20;
  while (suggestions === null && counter > 0) {
    // Press Tab
    await page.keyboard.press('Tab');

    // Wait for completion pop-up
    try {
      suggestions = await page.waitForSelector('code:has-text("yMagic")', {
        timeout: 1000,
      });
    } catch {
    } finally {
      counter -= 1;
    }
  }

  // Click on suggestions
  await Promise.all([
    page.waitForSelector('code:has-text("yMagic")', { state: 'hidden' }),
    suggestions.click(),
  ]);

  expect(
    await page.waitForSelector('text=yMagic', { state: 'visible' })
  ).toBeTruthy();
});
