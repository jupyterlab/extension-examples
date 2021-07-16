import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should open a widget panel', async ({ page }) => {
  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash');
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });

  // Click text=Widget Example
  await page.click('text=Widget Example');

  // Click ul[role="menu"] >> text=Open a Tab Widget
  await page.click('ul[role="menu"] >> text=Open a Tab Widget');

  expect(await page.screenshot()).toMatchSnapshot('widgets-example.png');

  // Add delay for better documentation
  await page.waitForTimeout(500);
});
