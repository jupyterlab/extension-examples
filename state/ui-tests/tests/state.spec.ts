import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should store state between reloads', async ({ page }) => {
  await page.goto(`${TARGET_URL}/lab`);
  await page.locator('#jupyterlab-splash').waitFor({ state: 'detached' });
  await page.locator('div[role="main"] >> text=Launcher').waitFor();

  const select = page.locator('.jp-Dialog-body >> select');
  // Check select current value
  await expect.soft(select).toHaveValue('one');

  // Select two
  await select.selectOption({ label: 'two' });

  // Check select current value
  await expect.soft(select).toHaveValue('two');

  await Promise.all([
    page.waitForRequest(
      (request) =>
        request.url().search(/\/api\/workspaces\/default/) >= 0 &&
        request.method() === 'PUT' &&
        '@jupyterlab-examples/state:state-example' in
          request.postDataJSON()?.data
    ),
    page.getByRole('button', { name: /ok/i }).click(),
  ]);

  // Reload page
  await page.reload();
  await page.locator('#jupyterlab-splash').waitFor({ state: 'detached' });
  await page.locator('div[role="main"] >> text=Launcher').waitFor();

  await expect(select).toHaveValue('two');
});
