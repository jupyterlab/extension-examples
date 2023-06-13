import { test, expect } from '@jupyterlab/galata';

test('should open a panel connected to a kernel', async ({ page }) => {
  await page.menu.clickMenuItem(
    'Kernel Messaging>Open the Kernel Messaging Panel'
  );

  await page.getByRole('button', { name: 'Select' }).click();

  // Trick to wait for the kenel
  await page.waitForTimeout(200);

  await page.getByRole('button', { name: 'Compute 3+5' }).click();

  await expect
    .soft(
      page.getByText(
        '{"data":{"text/plain":"8"},"metadata":{},"execution_count":1}'
      )
    )
    .toHaveCount(1);

  // Close filebrowser
  await Promise.all([
    page.waitForSelector('#filebrowser', { state: 'hidden' }),
    page.menu.clickMenuItem('View>File Browser')
  ]);

  // Compare screenshot with a stored reference.
  expect(await page.screenshot()).toMatchSnapshot(
    'kernel-messaging-example.png'
  );
});
