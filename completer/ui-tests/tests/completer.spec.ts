import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('test', async ({ page }) => {
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

  // Click div[role="presentation"]:has-text("​")
  await page.click('div[role="presentation"]:has-text("​")');

  // Fill textarea
  await page.fill('textarea', 'import ');

  // Press Tab
  await page.press('textarea', 'Tab');

  // Press Tab
  await page.press('textarea', 'Tab');

  // Click code:has-text("abc")
  await page.click('code:has-text("abc")');

  expect(await page.waitForSelector('text=abc')).toBeTruthy();
});
