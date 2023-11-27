import { expect, test } from '@jupyterlab/galata';

test('should emit an activation console message', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Clap' })).toBeVisible();
});
