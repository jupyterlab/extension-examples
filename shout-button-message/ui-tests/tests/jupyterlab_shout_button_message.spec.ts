import { test, expect } from '@jupyterlab/galata';

test('should add a shout button', async ({ page }) => {
  await expect(page.locator('.jp-shout-button')).toHaveText('Press to Shout');
});
