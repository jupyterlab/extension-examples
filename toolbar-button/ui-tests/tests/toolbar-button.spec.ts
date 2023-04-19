import { test, expect } from '@jupyterlab/galata';

test('should clear all outputs when clicked', async ({ page }) => {
  // Create a new Notebook
  await page.menu.clickMenuItem('File>New>Notebook');
  await page.click('button:has-text("Select")');

  await page.waitForSelector('text=| Idle');

  await page.notebook.setCell(0, 'code', 'print("Hello, JupyterLab")');
  await page.keyboard.press('Shift+Enter');

  await page.notebook.setCell(1, 'code', 'print("Welcome to JupyterLab")');
  await page.keyboard.press('Shift+Enter');

  const OUTPUT = '.lm-Widget.jp-RenderedText >> text=Hello, JupyterLab';
  expect(await page.waitForSelector(OUTPUT)).toBeTruthy();

  await page.click('button:has-text("Clear Outputs of All Cells")');

  let failed = true;
  try {
    await page.waitForSelector(OUTPUT, { timeout: 200 });
  } catch (e) {
    failed = false;
    expect(e).toBeTruthy();
  }
  expect(failed).toBe(false);
});
