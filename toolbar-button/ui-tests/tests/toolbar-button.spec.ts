import { test, expect } from '@jupyterlab/galata';

test('should clear all outputs when clicked', async ({ page }) => {
  // Create a new Notebook
  await page.menu.clickMenuItem('File>New>Notebook');
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
  const OUTPUT = '.lm-Widget.jp-RenderedText >> text=Hello, JupyterLab';
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
