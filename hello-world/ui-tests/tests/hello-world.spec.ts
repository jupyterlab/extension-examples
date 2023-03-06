import { test, expect } from '@jupyterlab/galata';

test('should emit console message', async ({ page }) => {
  const logs: string[] = [];

  page.on('console', (message) => {
    logs.push(message.text());
  });

  expect(
    logs.filter((s) => s.startsWith('the JupyterLab main application'))
  ).toHaveLength(1);
});
