import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should store state between reloads', async ({ page }) => {
  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash');
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });

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

  const select = await page.waitForSelector(
    'text=Pick an option to persist by the State Example extensiononetwothreeCancelOK >> select'
  );

  // Click button:has-text("OK")
  await page.click('button:has-text("OK")');

  // Reload page
  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash');
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });

  expect(
    await page.$eval<string, HTMLSelectElement>(
      'text=Pick an option to persist by the State Example extensiononetwothreeCancelOK >> select',
      (s) => s.value
    )
  ).toEqual('two');

  // Add delay for better documentation
  await page.waitForTimeout(500);
});
