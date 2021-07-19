import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should store state between reloads', async ({ page }) => {
  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });
  await page.waitForSelector('text=Launcher');

  // Check select current value
  expect(
    await page.$eval<string, HTMLSelectElement>(
      'text=Pick an option to persist by the State Example extensiononetwothreeCancelOK >> select',
      (s) => s.value
    )
  ).toEqual('one');

  // Select two
  await page.selectOption(
    'text=Pick an option to persist by the State Example extensiononetwothreeCancelOK >> select',
    'two'
  );

  // Check select current value
  expect(
    await page.$eval<string, HTMLSelectElement>(
      'text=Pick an option to persist by the State Example extensiononetwothreeCancelOK >> select',
      (s) => s.value
    )
  ).toEqual('two');

  // Click button:has-text("OK")
  await Promise.all([
    page.waitForRequest(
      (request) =>
        request.url().search(/\/api\/workspaces\/default/) >= 0 &&
        request.method() === 'PUT' &&
        '@jupyterlab-examples/state:state-example' in
          request.postDataJSON()?.data
    ),
    page.click('button:has-text("OK")'),
  ]);

  // Reload page
  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });
  await page.waitForSelector('text=Launcher');

  expect(
    await page.$eval<string, HTMLSelectElement>(
      'text=Pick an option to persist by the State Example extensiononetwothreeCancelOK >> select',
      (s) => s.value
    )
  ).toEqual('two');
});
