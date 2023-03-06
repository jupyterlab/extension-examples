import { test, expect } from '@jupyterlab/galata';

test('should have new context menu for example files', async ({ page }) => {
  // Click li[role="menuitem"]:has-text("File")
  await page.click('li[role="menuitem"]:has-text("File")');
  // Click ul[role="menu"] >> text=New
  await page.click('ul[role="menu"] >> text=New');
  // Click #jp-mainmenu-file-new >> text=Text File
  await page.click('#jp-mainmenu-file-new >> text=Text File');

  // Click [aria-label="File Browser Section"] >> text=untitled.txt
  await page.click('[aria-label="File Browser Section"] >> text=untitled.txt', {
    button: 'right',
  });

  // Click text=Rename
  await page.click('text=Rename');

  // Fill file browser >> input
  await page.fill('input.jp-DirListing-editor', 'test.example');

  // Press Enter
  await page.press('input.jp-DirListing-editor', 'Enter');

  // Wait for the data attribute to be set
  await page.waitForTimeout(200);

  // Click [aria-label="File Browser Section"] >> text=test.example
  await page.click('[aria-label="File Browser Section"] >> text=test.example', {
    button: 'right',
  });

  // Click ul[role="menu"] >> text=Example
  await page.click('ul[role="menu"] >> text=Example');

  // Click text=Path: test.example
  expect(await page.waitForSelector('text=Path: test.example')).toBeTruthy();

  // Click button:has-text("OK")
  await page.click('button:has-text("OK")');
});
