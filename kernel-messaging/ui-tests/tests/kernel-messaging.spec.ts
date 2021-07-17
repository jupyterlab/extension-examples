import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should open a panel connected to a kernel', async ({ page }) => {
  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });
  await page.waitForSelector('text=Launcher');

  // Click text=Kernel Messaging
  await page.click('text=Kernel Messaging');

  // Click ul[role="menu"] >> text=Open the Kernel Messaging Panel
  await page.click('ul[role="menu"] >> text=Open the Kernel Messaging Panel');

  // Click button:has-text("Select")
  await page.click('button:has-text("Select")');

  // Click text=Compute 3+5
  await page.click('text=Compute 3+5');

  // wait for text=/.*\{"data":\{"text/plain":"8"\},"metadata":\{\},"execution_count":1\}.*/
  expect(
    await page.waitForSelector(
      'text=/.*"data":{"text/plain":"8"},"metadata":{}.*/'
    )
  ).toBeTruthy();

  // Close filebrowser
  await page.click('text=View');
  await Promise.all([
    page.waitForSelector('#filebrowser', { state: 'hidden' }),
    page.click('ul[role="menu"] >> text=Show Left Sidebar'),
  ]);

  // Compare screenshot with a stored reference.
  expect(await page.screenshot()).toMatchSnapshot(
    'kernel-messaging-example.png'
  );

  // Add delay for better documentation
  await page.waitForTimeout(500);
});
