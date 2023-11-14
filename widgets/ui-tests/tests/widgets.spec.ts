import { test, expect } from '@jupyterlab/galata';

test('should open a widget panel', async ({ page }) => {
  // Close filebrowser
  await Promise.all([
    page.waitForSelector('#filebrowser', { state: 'hidden' }),
    page.menu.clickMenuItem('View>File Browser')
  ]);

  // Open a new tab from menu
  await page.menu.clickMenuItem('Widget Example>Open a Tab Widget');

  let resolveAlert: (arg0: boolean) => void;
  const gotAlerted = new Promise<boolean>(resolve => {
    resolveAlert = resolve;
  });
  page.on('dialog', dialog => {
    if (dialog.message() == 'You clicked on the widget') {
      resolveAlert(true);
    }
    dialog.accept();
  });

  await page.getByRole('main').getByLabel('Widget Example View').click();

  expect(await gotAlerted).toEqual(true);

  expect(await page.screenshot()).toMatchSnapshot('widgets-example.png');
});
