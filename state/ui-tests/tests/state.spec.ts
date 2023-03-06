import { test, expect } from '@jupyterlab/galata';

test.use({
  waitForApplication: async (page) => {
    await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });
    await page.waitForSelector('div[role="main"] >> text=Launcher');
  },
});

test('should store state between reloads', async ({ page }) => {
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

  expect(
    await page.$eval<string, HTMLSelectElement>(
      'text=Pick an option to persist by the State Example extensiononetwothreeCancelOK >> select',
      (s) => s.value
    )
  ).toEqual('two');
});
