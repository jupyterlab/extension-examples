import { test, expect } from '@jupyterlab/galata';

test('should add a top area text', async ({ page }) => {
  await expect(page.locator('.jp-TopAreaText')).toHaveText('Hello World');
});
