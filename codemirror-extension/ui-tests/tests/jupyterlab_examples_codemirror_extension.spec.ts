import { expect, test } from '@jupyterlab/galata';

test('should display zebra stripes in cell editors', async ({ page }) => {
  // Create a notebook and wait for the first editor to be ready.
  await page.notebook.createNew();
  const firstEditor = page.locator('.jp-Cell .cm-editor').first();
  await expect(firstEditor).toBeVisible();

  // Fill the first cell
  await page.notebook.setCell(
    0,
    'markdown',
    '# First line\n# Second line\n# Third line\n'
  );

  // Open the editor
  await page.menu.clickMenuItem('Settings>Settings Editor');

  await page.getByRole('tab', { name: 'CodeMirror' }).click();

  // Change the step
  const stepInput = page.locator(
    '[id="root_\\@jupyterlab-examples\\/codemirror\\:zebra-stripes"]'
  );
  await expect(stepInput).toBeVisible();
  await stepInput.fill('3');
  await stepInput.press('Enter');

  await page.getByRole('tab', { name: 'Untitled.ipynb' }).click();

  await page
    .locator('.jp-Notebook-ExecutionIndicator[data-status="idle"]')
    .waitFor();

  await expect(firstEditor.locator('.cm-zebraStripe')).toHaveCount(1);
  await expect(page.locator('.jp-Cell').first()).toHaveScreenshot(
    'codemirror-extension.png',
    {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixels: 200
    }
  );
});
