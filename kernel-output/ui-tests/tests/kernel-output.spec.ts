import { test, expect } from '@jupyterlab/galata';

test('should open a panel connected to a notebook kernel', async ({ page }) => {
  test.setTimeout(120000);

  // Install pandas through console
  await page.menu.clickMenuItem('File>New>Console');
  await page.getByRole('button', { name: 'Select' }).click();
  await page.getByText('| Idle').waitFor();

  await page.click('.jp-CodeConsole-promptCell .jp-InputArea-editor');
  await page.keyboard.type('!mamba install -qy pandas', { delay: 100 });

  await page.menu.clickMenuItem('Run>Run Cell (forced)');

  // Create a notebook
  await page.notebook.createNew();
  await page.getByText('| Idle').waitFor();

  await page.notebook.setCell(
    0,
    'code',
    'import numpy\nimport pandas\ndf = pandas.DataFrame(numpy.eye(5))'
  );
  await page.notebook.runCell(0);

  await page.menu.clickMenuItem('Kernel Output>Open the Kernel Output Panel');

  // Select Notebook kernel
  await page.locator('.jp-Dialog-body').locator('select').selectOption({
    label: 'Untitled.ipynb'
  });

  await page.getByRole('button', { name: 'Select Kernel' }).click();

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

  await page.menu.clickMenuItem(
    'Kernel Output>Contact Kernel and Execute Code'
  );

  // Fill [placeholder="Statement to execute"]
  await page.locator('[placeholder="Statement to execute"]').fill('df');

  await page.getByRole('button', { name: 'Execute' }).click();

  await expect.soft(page.locator('th')).toHaveCount(11);

  // Close filebrowser
  await Promise.all([
    page.locator('#filebrowser').waitFor({ state: 'hidden' }),
    page.menu.clickMenuItem('View>File Browser')
  ]);

  // Compare screenshot with a stored reference.
  expect(await page.screenshot()).toMatchSnapshot('kernel-output-example.png');
});
