import { test, expect } from '@jupyterlab/galata';

test.use({ autoGoto: false });

test('should emit console message', async ({ page }) => {
  const logs: string[] = [];

  page.on('console', (message) => {
    logs.push(message.text());
  });

  await page.goto();

  expect
    .soft(
      logs.filter(
        (s) =>
          s ===
          "Settings Example extension: Limit is set to '25' and flag to 'false'"
      )
    )
    .toHaveLength(1);

  // Click text=Toggle Flag and Increment Limit
  await page.getByRole('menuitem', { name: 'Settings Example' }).click();

  page.once('console', (message) => {
    expect
      .soft(message.text())
      .toEqual(
        "Settings Example extension: Limit is set to '26' and flag to 'true'"
      );
  });

  page.once('dialog', (dialog) => {
    expect
      .soft(dialog.message())
      .toEqual(
        "Settings Example extension: Limit is set to '26' and flag to 'true'"
      );
    dialog.dismiss().catch(() => {});
  });
  await Promise.all([
    page.waitForEvent('console'),
    page.waitForEvent('dialog'),
    page
      .getByRole('menuitem', { name: 'Toggle Flag and Increment Limit' })
      .click(),
  ]);

  await page.getByRole('menuitem', { name: 'Settings Example' }).click();
  await expect
    .soft(
      page.getByRole('menuitem', { name: 'Toggle Flag and Increment Limit' })
    )
    .toHaveClass(/lm-mod-toggled/);

  await page.keyboard.press('Escape');

  await page.getByRole('menuitem', { name: 'Settings', exact: true }).click();
  await page
    .getByRole('menuitem', { name: 'Advanced Settings Editor' })
    .click();

  await page.getByRole('tab', { name: 'Settings Example' }).click();

  let msg = '';
  page.once('console', (message) => {
    msg = message.text();
  });

  await page
    .locator(
      '[id="jp-SettingsEditor-\\@jupyterlab-examples\\/settings\\:settings-example_limit"]'
    )
    .fill('27');

  await page.waitForEvent('console');

  expect(msg).toEqual(
    "Settings Example extension: Limit is set to '27' and flag to 'true'"
  );
});
