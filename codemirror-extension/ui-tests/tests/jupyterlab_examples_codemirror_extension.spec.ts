import { expect, test } from '@jupyterlab/galata';

test('should emit an activation console message', async ({ page }) => {
  // Create a notebook
  await page
    .getByRole('main')
    .getByTitle('Python 3 (ipykernel)')
    .first()
    .click();

  await page
    .getByRole('region', { name: 'notebook content' })
    .getByRole('textbox')
    .waitFor();

  await page.locator('.jp-Cell .cm-editor').first().waitFor();

  // Fill the first cell
  await page.notebook.setCell(
    0,
    'code',
    '# First line\n# Second line\n# Third line\n'
  );

  // Open the editor
  await page.menu.clickMenuItem('Settings>Settings Editor');

  await page
    .getByRole('tab', { name: 'CodeMirror CodeMirror' })
    .getByText('CodeMirror')
    .click();

  // Change the step
  await page
    .locator('[id="root_\\@jupyterlab-examples\\/codemirror\\:zebra-stripes"]')
    .fill('3');

  // Wait for the new settings to be saved and propagate
  await page.waitForTimeout(1000);

  await page.getByRole('tab', { name: 'Untitled.ipynb' }).click();

  await page
    .locator('.jp-Notebook-ExecutionIndicator[data-status="idle"]')
    .waitFor();

  const notebook = await page.activity.getPanel();

  expect(await notebook!.screenshot()).toMatchSnapshot(
    'codemirror-extension.png'
  );
});
