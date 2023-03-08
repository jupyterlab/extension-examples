import { test, expect } from '@jupyterlab/galata';

test('should clear all outputs when clicked', async ({ page }) => {
  // Click text=File
  await page.click('text=File');
  // Click ul[role="menu"] >> text=New
  await page.click('ul[role="menu"] >> text=New');
  // Click #jp-mainmenu-file-new >> text=Notebook
  await page.click('#jp-mainmenu-file-new >> text=Notebook');
  // Click button:has-text("Select")
  await page.click('button:has-text("Select")');

  await page.waitForSelector('text=| Idle');

  // Fill textarea
  await page.notebook.setCell(0, 'code', 'print("Hello, JupyterLab")');
  // Press Enter with modifiers
  await page.keyboard.press('Shift+Enter');

  // Fill text=[ ]: ​ >> textarea
  await page.notebook.setCell(1, 'code', 'print("Welcome to JupyterLab")');
  // Press Enter with modifiers
  await page.keyboard.press('Shift+Enter');

  // Click .lm-Widget.p-Widget.jp-RenderedText
  const OUTPUT =
    '.lm-Widget.p-Widget.jp-RenderedText >> text=Hello, JupyterLab';
  expect(await page.waitForSelector(OUTPUT)).toBeTruthy();

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
