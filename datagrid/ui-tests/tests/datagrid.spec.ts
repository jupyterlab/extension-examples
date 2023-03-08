import { test, expect } from '@jupyterlab/galata';

test('should open a datagrid panel', async ({ page }) => {
  // Close filebrowser
  await page.click('text=View');
  await Promise.all([
    page.waitForSelector('#filebrowser', { state: 'hidden' }),
    page.click('ul[role="menu"] >> text=Show Left Sidebar'),
  ]);

  // Click text=DataGrid Example
  await page.click('text=DataGrid Example');
  // Click ul[role="menu"] >> text=Open a Datagrid
  await page.click('ul[role="menu"] >> text=Open a Datagrid');

  expect(
    await page.waitForSelector('div[role="main"] >> text=Datagrid Example View')
  ).toBeTruthy();

  // Compare screenshot with a stored reference.
  expect(await page.screenshot()).toMatchSnapshot('datagrid-example.png');
});
