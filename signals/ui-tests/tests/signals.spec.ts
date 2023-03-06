import { test, expect } from '@jupyterlab/galata';

test('should emit console message and alert when button is pressed', async ({
  page,
}) => {
  // Click text=Signal Example
  await page.click('text=Signal Example');

  // Click ul[role="menu"] >> text=Open the Signal Example Panel
  await page.click('ul[role="menu"] >> text=Open the Signal Example Panel');

  // Click text=Click me
  page.once('console', (message) => {
    expect(
      message.text().startsWith('Hey, a Signal has been received from')
    ).toEqual(true);
  });
  page.once('dialog', (dialog) => {
    expect(dialog.message()).toEqual(
      'The big red button has been clicked 1 times.'
    );
    dialog.dismiss().catch(() => {});
  });
  await page.click('text=Click me');

  // Close filebrowser
  await page.click('text=View');
  await Promise.all([
    page.waitForSelector('#filebrowser', { state: 'hidden' }),
    page.click('ul[role="menu"] >> text=Show Left Sidebar'),
  ]);

  expect(await page.screenshot()).toMatchSnapshot('signals-example.png');
});
