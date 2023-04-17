import { test, expect } from '@jupyterlab/galata';
import { ElementHandle } from '@playwright/test';

test('should open a notebook and use the completer', async ({ page }) => {
  // Create a new Notebook
  await page.menu.clickMenuItem('File>New>Notebook');
  await page.click('button:has-text("Select")');

  // Wait until kernel is ready
  await page.waitForSelector(
    '#jp-main-statusbar >> text=Python 3 (ipykernel) | Idle'
  );

  // Type 'y' in first cell
  await page.notebook.enterCellEditingMode(0);
  await page.keyboard.press('y');

  let suggestions: ElementHandle<SVGElement | HTMLElement> | null = null;
  let counter = 20;
  while (suggestions === null && counter > 0) {
    // Press Tab
    await page.keyboard.press('Tab');

    // Wait for completion pop-up
    try {
      suggestions = await page.waitForSelector('code:has-text("yMagic")', {
        timeout: 1000
      });
    } catch {
      await page.keyboard.press('Backspace');
    } finally {
      counter -= 1;
    }
  }

  // Click on suggestions
  await Promise.all([
    page.waitForSelector('code:has-text("yMagic")', { state: 'hidden' }),
    suggestions!.click()
  ]);

  expect(
    await page.waitForSelector('text=yMagic', { state: 'visible' })
  ).toBeTruthy();
});
