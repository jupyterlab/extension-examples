import { test, expect } from '@jupyterlab/galata';

test('should have new context menu for example files', async ({ page }) => {
  await page.getByRole('menuitem', { name: 'File' }).click();
  await page.getByRole('listitem').filter({ hasText: 'New' }).click();
  await page.getByRole('menuitem', { name: 'Text File', exact: true }).click();

  await page
    .locator('[aria-label="File Browser Section"]')
    .getByText('untitled.txt')
    .click({
      button: 'right'
    });

  await page.getByRole('menuitem', { name: 'Rename' }).click();

  // Fill file browser >> input
  await page.locator('input.jp-DirListing-editor').fill('test.example');

  // Press Enter
  await page.locator('input.jp-DirListing-editor').press('Enter');

  // Wait for the data attribute to be set
  await page.waitForTimeout(200);

  await page
    .locator('[aria-label="File Browser Section"]')
    .getByText('test.example')
    .click({
      button: 'right'
    });

  await page.getByRole('menuitem', { name: 'Example' }).click();

  await expect(page.getByText(/^Path: ([\w-]+\/)?test\.example$/)).toHaveCount(
    1
  );

  await page.getByRole('button', { name: /ok/i }).click();
});
