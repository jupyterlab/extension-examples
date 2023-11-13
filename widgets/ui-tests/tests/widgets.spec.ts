import { test, expect } from '@jupyterlab/galata';

test('should open a widget panel', async ({ page }) => {
  // Close filebrowser
  await Promise.all([
    page.waitForSelector('#filebrowser', { state: 'hidden' }),
    page.menu.clickMenuItem('View>File Browser')
  ]);

  // Open a new tab from menu
  await page.menu.clickMenuItem('Widget Example>Open a Tab Widget');

  await page.getByRole('main').getByText('Widget Example View');

  let gotAlerted = false;
  page.on('dialog', dialog => {
    gotAlerted = dialog.message() == 'You clicked on the widget';
  });
  await page.getByRole('main').locator('.jp-example-view').click();

  expect(gotAlerted).toEqual(true);

  expect(await page.screenshot()).toMatchSnapshot('widgets-example.png');
});
