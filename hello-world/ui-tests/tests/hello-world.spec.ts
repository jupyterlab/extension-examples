import { test, expect } from '@jupyterlab/galata';

test.use({ autoGoto: false });

test('should emit console message', async ({ page }) => {
  const logs: string[] = [];

  page.on('console', (message) => {
    logs.push(message.text());
  });

  await page.goto();

  expect(
    logs.filter((s) => s.startsWith('the JupyterLab main application'))
  ).toHaveLength(1);
});
