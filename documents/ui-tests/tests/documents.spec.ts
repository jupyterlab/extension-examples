import { test, expect } from '@jupyterlab/galata';

test('should check if the cube is loaded', async ({ page }) => {
  await page.menu.clickMenuItem('File>New>Text File');

  await page
    /*.getByRole('region', { name: 'notebook content' })*/
    .getByRole('textbox')
    .fill('{\n\t"x": 177,\n\t"y": 301,\n\t"content": "Hello YJS!"\n}');

  // Press s with modifiers
  await page.keyboard.press('Control+s');

  // Rename the file
  await page.getByPlaceholder('File name').fill('untitled.example');
  await page.getByRole('button', { name: 'Rename' }).click();

  // Close file
  await page.menu.clickMenuItem('File>Close Tab');

  expect.soft(await page.waitForSelector('text=untitled.example')).toBeTruthy();

  // Click text=untitled.example
  await page.dblclick('text=untitled.example');

  await page.waitForSelector('div[role="main"] >> text=untitled.example');

  expect.soft(await page.waitForSelector('text=Hello YJS!')).toBeTruthy();

  // Close filebrowser
  await Promise.all([
    page.waitForSelector('#filebrowser', { state: 'hidden' }),
    page.menu.clickMenuItem('View>Appearance>Show Left Sidebar')
  ]);

  await page.dragAndDrop(
    'text=Hello YJS!',
    'div[role="region"]:has-text("Hello YJS!")'
  );

  // Click text=Hello YJS!
  await page.click('text=Hello YJS!');

  // Press s with modifiers
  await page.keyboard.press('Control+s');

  // Compare screenshot with a stored reference.
  expect(
    await (await page.waitForSelector('div[role="main"]')).screenshot()
  ).toMatchSnapshot('documents-example.png');
});
