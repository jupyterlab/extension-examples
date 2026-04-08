import { test, expect } from '@jupyterlab/galata';

test('should open a panel connected to a notebook kernel', async ({ page }) => {
  // Install pandas through console.
  await page.menu.clickMenuItem('File>New>Console');
  await page.getByRole('button', { name: 'Select' }).click();
  const idleStatus = page.locator('#jp-main-statusbar').getByText('| Idle');
  await idleStatus.waitFor();

  await page.click('.jp-CodeConsole-promptCell .jp-InputArea-editor');
  await page.keyboard.type('!mamba install -qy pandas', { delay: 100 });
  await page.menu.clickMenuItem('Run>Run Cell (forced)');
  await idleStatus.waitFor();

  // Create a notebook
  await page.notebook.createNew();
  await page
    .locator('.jp-Notebook-ExecutionIndicator[data-status="idle"]')
    .waitFor();

  await page.notebook.setCell(
    0,
    'code',
    'import numpy\nimport pandas\ndf = pandas.DataFrame(numpy.eye(5))'
  );
  await page.notebook.runCell(0);
  await page
    .locator('.jp-Notebook-ExecutionIndicator[data-status="idle"]')
    .waitFor();

  await page.menu.clickMenuItem('Kernel Output>Open the Kernel Output Panel');

  // Select Notebook kernel
  const dialog = page.locator('.jp-Dialog');
  await expect(dialog).toBeVisible();
  const select = dialog.locator('select');
  await expect(select).toBeVisible();
  const optionLocator = select.locator('option', {
    hasText: /Untitled.ipynb.*/
  });
  await expect(optionLocator).toHaveCount(1);
  const notebookOption = optionLocator.first();
  const value = await notebookOption.getAttribute('value');
  expect(value).toBeTruthy();
  await page
    .locator('.jp-Dialog-body')
    .locator('select')
    .selectOption({ value: value! });

  await page.getByRole('button', { name: 'Select Kernel' }).click();
  await expect(page.locator('#kernel-output-panel')).toBeVisible();
  await page.evaluate(async () => {
    type SessionLike = { ready: Promise<void> };
    type WidgetLike = { id: string; session?: SessionLike };
    type AppLike = {
      shell: { widgets: (area: 'main') => Iterable<WidgetLike> };
    };

    const app = (window as Window & { jupyterapp?: AppLike }).jupyterapp;
    const panel = app
      ? Array.from(app.shell.widgets('main')).find(
          widget => widget.id === 'kernel-output-panel'
        )
      : undefined;

    if (!panel?.session) {
      throw new Error('Kernel output panel session is not ready.');
    }

    await panel.session.ready;
  });

  // Emulate drag and drop to place the panel next to the notebook
  const viewerHandle = page
    .locator('div[role="main"] >> text=Kernel Output Example View')
    .first();
  const panelHandle = page.locator('#kernel-output-panel div').first();
  await expect(viewerHandle).toBeVisible();
  await expect(panelHandle).toBeVisible();
  const viewerBBox = await viewerHandle.boundingBox();
  const panelBBox = await panelHandle.boundingBox();
  if (!viewerBBox || !panelBBox) {
    throw new Error(
      'Could not determine the panel positions for drag and drop placement.'
    );
  }

  await page.mouse.move(
    viewerBBox.x + 0.5 * viewerBBox.width,
    viewerBBox.y + 0.5 * viewerBBox.height
  );
  await page.mouse.down();
  await page.mouse.move(
    panelBBox.x + 0.8 * panelBBox.width,
    panelBBox.y + 0.5 * panelBBox.height
  );
  await page.mouse.up();

  // Click div[role="main"] >> text=Kernel Output Example View
  await viewerHandle.click();

  await page.menu.clickMenuItem(
    'Kernel Output>Contact Kernel and Execute Code'
  );

  // Fill [placeholder="Statement to execute"]
  await page.locator('[placeholder="Statement to execute"]').fill('df');

  await page.getByRole('button', { name: 'Execute' }).click();

  const outputPanel = page.locator('#kernel-output-panel');
  await expect(outputPanel.locator('table')).toHaveCount(1);
  await expect(outputPanel.locator('th')).toHaveCount(11);

  // Close filebrowser
  await Promise.all([
    page.locator('#filebrowser').waitFor({ state: 'hidden' }),
    page.menu.clickMenuItem('View>File Browser')
  ]);

  // Compare screenshot with a stored reference.
  expect(
    await page.screenshot({
      animations: 'disabled',
      caret: 'hide'
    })
  ).toMatchSnapshot('kernel-output-example.png', { maxDiffPixels: 500 });
});
