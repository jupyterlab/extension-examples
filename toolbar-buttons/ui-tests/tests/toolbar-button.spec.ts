import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should clear all outputs when clicked', async ({ page }) => {
  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });
  await page.waitForSelector('div[role="main"] >> text=Launcher');

  // Click text=File
  await page.click('text=File');
  // Click ul[role="menu"] >> text=New
  await page.click('ul[role="menu"] >> text=New');
  // Click #jp-mainmenu-file-new >> text=Notebook
  await page.click('#jp-mainmenu-file-new >> text=Notebook');
  // Click button:has-text("Select")
  await page.click('button:has-text("Select")');

  await page.waitForSelector('text=Idle');

  // Fill textarea
  await page.fill('textarea', 'print("Hello, JupyterLab")');
  // Press Enter with modifiers
  await page.press('textarea', 'Shift+Enter');

  // Fill text=[ ]: ​ >> textarea
  const secondCell = await page.waitForSelector('text=[ ]: ​ >> textarea');
  await secondCell.fill('print("Welcome to JupyterLab")');
  // Press Enter with modifiers
  await secondCell.press('Shift+Enter');

  // Click .lm-Widget.p-Widget.jp-RenderedText
  const OUTPUT =
    '.lm-Widget.p-Widget.jp-RenderedText >> text=Hello, JupyterLab';
  expect(await page.waitForSelector(OUTPUT)).toBeTruthy();

  // Click :nth-match(:text("Hello, JupyterLab"), 2)
  // await page.click(':nth-match(:text("Hello, JupyterLab"), 2)');

  // Click button:has-text("Clear All Outputs")
  await page.click('button:has-text("Clear All Outputs")');

  let failed = true;
  try {
    await page.waitForSelector(OUTPUT, { timeout: 200 });
  } catch (e) {
    failed = false;
    expect(e).toBeTruthy();
  }
  expect(failed).toBe(false);
});
