import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should open a widget panel', async ({ page }) => {
  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });
  await page.waitForSelector('text=Launcher');

  // Close filebrowser
  await page.click('text=View');
  await Promise.all([
    page.waitForSelector('#filebrowser', { state: 'hidden' }),
    page.click('ul[role="menu"] >> text=Show Left Sidebar'),
  ]);

  // Click text=Widget Example
  await page.click('text=Widget Example');

  // Click ul[role="menu"] >> text=Open a Tab Widget
  await page.click('ul[role="menu"] >> text=Open a Tab Widget');

  await page.click('text=Widget Example View');

  expect(await page.screenshot()).toMatchSnapshot('widgets-example.png');
});
