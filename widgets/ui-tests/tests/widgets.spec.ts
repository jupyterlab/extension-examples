import { test, expect } from '@jupyterlab/galata';

test('should open a widget panel', async ({ page }) => {
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

  await page.click('div[role="main"] >> text=Widget Example View');

  expect(await page.screenshot()).toMatchSnapshot('widgets-example.png');
});
