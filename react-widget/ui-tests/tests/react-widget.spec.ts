import { test, expect } from '@jupyterlab/galata';

test('should open a new panel with a react component', async ({ page }) => {
  // Click text=React Widget
  await page.click('text=React Widget');

  // Click text=You clicked 0 times!
  expect(await page.waitForSelector('text=You clicked 0 times!')).toBeTruthy();

  // Click text=Increment
  await page.click('text=Increment');
  // Click text=Increment
  await page.click('text=Increment');
  // Click text=Increment
  await page.click('text=Increment');
  // Click text=Increment
  await page.click('text=Increment');

  // Click text=You clicked 4 times!
  expect(await page.waitForSelector('text=You clicked 4 times!')).toBeTruthy();

  // Close filebrowser
  await page.click('text=View');
  await Promise.all([
    page.waitForSelector('#filebrowser', { state: 'hidden' }),
    page.click('ul[role="menu"] >> text=Show Left Sidebar'),
  ]);

  expect(await page.screenshot()).toMatchSnapshot('react-widget-example.png');
});
