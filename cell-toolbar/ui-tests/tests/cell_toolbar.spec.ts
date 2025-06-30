import { expect, test } from '@jupyterlab/galata';

test('should add buttons on code cell and markdown cell', async ({ page }) => {
  // Create a new Notebook
  await page.menu.clickMenuItem('File>New>Notebook');
  await page.click('button:has-text("Select")');

  await page.waitForSelector('text=| Idle');

  const RUN_CODE =
    '.jp-cell-toolbar jp-button[data-command="toolbar-button:run-code-cell"]';
  const RENDER_MD =
    '.jp-cell-toolbar jp-button[data-command="toolbar-button:render-markdown-cell"]';

  await page.notebook.setCell(0, 'code', 'print("Hello, JupyterLab")');
  await expect(page.locator(RUN_CODE)).toBeVisible();
  await expect(page.locator(RENDER_MD)).toBeHidden();

  await page.locator(RUN_CODE).click();

  const OUTPUT = '.lm-Widget.jp-RenderedText >> text=Hello, JupyterLab';
  expect(await page.waitForSelector(OUTPUT)).toBeTruthy();

  await page.notebook.setCell(0, 'markdown', '### Hello, JupyterLab');
  await expect(page.locator(RUN_CODE)).toBeHidden();
  await expect(page.locator(RENDER_MD)).toBeVisible();

  await page.locator(RENDER_MD).click();
  const RENDERED_MD = '.jp-MarkdownCell.jp-mod-rendered';
  expect(await page.waitForSelector(RENDERED_MD)).toBeTruthy();

  await page.notebook.setCell(0, 'raw', 'Hello, JupyterLab');
  await expect(page.locator(RUN_CODE)).toBeHidden();
  await expect(page.locator(RENDER_MD)).toBeHidden();
});
