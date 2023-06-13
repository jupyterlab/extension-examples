import { test, expect } from '@jupyterlab/galata';

test('should open a datagrid panel', async ({ page }) => {
  // Close filebrowser

  // Click on DataGrid Example
  await page.getByText('DataGrid Example').click();
  // Click on Open a Datagrid
  await page.getByRole('menuitem', { name: 'Open a Datagrid' }).click();

  expect(
    await page.waitForSelector('div[role="main"] >> text=Datagrid Example View')
  ).toBeTruthy();

  // Compare screenshot with a stored reference.
  expect(await page.screenshot()).toMatchSnapshot('datagrid-example.png');
});
