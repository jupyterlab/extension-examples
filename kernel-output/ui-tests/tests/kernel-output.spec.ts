import { test, expect } from '@jupyterlab/galata';

test('should open a panel connected to a notebook kernel', async ({ page }) => {
  test.setTimeout(120000);

  // Install pandas through console
  await page.getByRole('menuitem', { name: 'File' }).click();
  await page.getByRole('listitem').filter({ hasText: 'New' }).click();
  await page.getByRole('menuitem', { name: 'Console', exact: true }).click();
  await page.getByRole('button', { name: 'Select' }).click();
  await page.getByText('| Idle').waitFor();

  await page.fill(
    '.jp-CodeConsole-input >> textarea',
    '!mamba install -qy pandas'
  );
  await page.getByRole('menuitem', { name: 'Run' }).click();
  await page.getByRole('menuitem', { name: 'Run Cell Shift+Enter' }).click();
  await page.waitForSelector('text=Executing transaction: ...working... done');

  // Create a notebook
  await page.getByRole('menuitem', { name: 'File' }).click();
  await page.getByRole('listitem').filter({ hasText: 'New' }).click();
  await page.getByRole('menuitem', { name: 'Notebook', exact: true }).click();
  await page.getByRole('button', { name: 'Select', exact: true }).click();
  await page.getByText('| Idle').waitFor();

  await page
    .getByRole('region', { name: 'notebook content' })
    .locator('.jp-Editor >> textarea')
    .fill('import numpy\nimport pandas\ndf = pandas.DataFrame(numpy.eye(5))');

  await page.getByRole('menuitem', { name: 'Run' }).click();
  await page
    .getByRole('menuitem', { name: 'Run Selected Cells Shift+Enter' })
    .click();

  await page.getByRole('menuitem', { name: 'Kernel Output' }).click();
  await page
    .getByRole('menuitem', { name: 'Open the Kernel Output Panel' })
    .click();

  // Select Notebook kernel
  await page.locator('.jp-Dialog-body').locator('select').selectOption({
    label: 'Untitled.ipynb',
  });

  await page.getByRole('button', { name: 'Select', exact: true }).click();

  // Emulate drag and drop to place the panel next to the notebook
  const viewerHandle = await page.$(
    'div[role="main"] >> text=Kernel Output Example View'
  );
  const panelHandle = await page.$('#kernel-output-panel div');
  const viewerBBox = await viewerHandle!.boundingBox();
  const panelBBox = await panelHandle!.boundingBox();

  await page.mouse.move(
    viewerBBox!.x + 0.5 * viewerBBox!.width,
    viewerBBox!.y + 0.5 * viewerBBox!.height
  );
  await page.mouse.down();
  await page.mouse.move(
    panelBBox!.x + 0.8 * panelBBox!.width,
    panelBBox!.y + 0.5 * panelBBox!.height
  );
  await page.mouse.up();

  // Click div[role="main"] >> text=Kernel Output Example View
  await page
    .locator('div[role="main"] >> text=Kernel Output Example View')
    .click();

  await page.getByRole('menuitem', { name: 'Kernel Output' }).click();
  await page
    .getByRole('menuitem', { name: 'Contact Kernel and Execute Code' })
    .click();

  // Fill [placeholder="Statement to execute"]
  await page.locator('[placeholder="Statement to execute"]').fill('df');

  await page.getByRole('button', { name: 'Execute' }).click();

  await expect.soft(page.locator('th')).toHaveCount(11);

  // Close filebrowser
  await page.getByText('View', { exact: true }).click();
  await Promise.all([
    page.locator('#filebrowser').waitFor({ state: 'hidden' }),
    page.getByRole('menuitem', { name: 'Show Left Sidebar Ctrl+B' }).click(),
  ]);

  // Compare screenshot with a stored reference.
  expect(await page.screenshot()).toMatchSnapshot('kernel-output-example.png');
});
