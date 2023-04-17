import { test, expect } from '@jupyterlab/galata';

test('should add a card to create Python file', async ({ page }) => {
  // Scroll to the new card
  await page.focus('text=Extension ExamplesPython File >> p');

  await page.click('text=Extension ExamplesPython File >> p');

  // Click div[role="main"] >> text=untitled.py
  await page.click('div[role="main"] >> text=untitled.py');
});

test('should add a submenu in jp-mainmenu-file-new', async ({ page }) => {
  // Click on the menu item
  await page.menu.clickMenuItem('File>New>Python File From Extension');

  // Click div[role="main"] >> text=untitled.py
  await page.click('div[role="main"] >> text=untitled.py');
});
