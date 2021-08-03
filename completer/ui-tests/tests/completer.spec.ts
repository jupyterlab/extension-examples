import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should open a notebook and use the completer', async ({ page }) => {
  // Go to http://localhost:8888/lab?
  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });
  await page.waitForSelector('div[role="main"] >> text=Launcher');

  // Close filebrowser
  await page.click('text=View');
  await Promise.all([
    page.waitForSelector('#filebrowser', { state: 'hidden' }),
    page.click('ul[role="menu"] >> text=Show Left Sidebar'),
  ]);

  // Click text=File
  await page.click('text=File');

  // Click ul[role="menu"] >> text=New
  await page.click('ul[role="menu"] >> text=New');

  // Click #jp-mainmenu-file-new >> text=Notebook
  await page.click('#jp-mainmenu-file-new >> text=Notebook');

  // Click button:has-text("Select")
  await page.click('button:has-text("Select")');

  // Wait until kernel is ready
  await page.waitForSelector(
    '#jp-main-statusbar >> text=Python 3 (ipykernel) | Idle'
  );

  // Click div[role="presentation"]:has-text("​")
  await page.click('div[role="presentation"]:has-text("​")');

  // Fill textarea
  await page.fill('textarea', 'y');

  let suggestions = null;
  let counter = 20;
  while (suggestions === null && counter > 0) {
    // Press Tab
    await page.keyboard.press('Tab');

    // Wait for completion pop-up
    try {
      suggestions = await page.waitForSelector('code:has-text("yMagic")', {
        timeout: 1000,
      });
    } catch {
    } finally {
      counter -= 1;
    }
  }

  // Increase tolerance as the cursor may or may not be captured
  //  - the threshold is low enough to check the completion pop-up is missing
  expect(
    await (await page.$('.jp-Notebook.jp-NotebookPanel-notebook')).screenshot()
  ).toMatchSnapshot('completer-example.png', { threshold: 0.2 });

  // Click on suggestions
  await suggestions.click();

  expect(await page.waitForSelector('text=yMagic')).toBeTruthy();
});
