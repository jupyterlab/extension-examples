import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should store state between reloads', async ({ page }) => {
  await Promise.all([
    page.waitForRequest(
      (request) =>
        request.url().search(/jlab-ext-example\/hello/) >= 0 &&
        request.method() === 'GET'
    ),
    page.waitForRequest(
      (request) =>
        request.url().search(/jlab-ext-example\/hello/) >= 0 &&
        request.method() === 'POST' &&
        request.postDataJSON()?.name === 'George'
    ),
    page.goto(`${TARGET_URL}/lab`),
  ]);

  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });
  await page.waitForSelector('div[role="main"] >> text=Launcher');

  await page
    .waitForSelector('text=Get Server Content in a IFrame Widget')
    .then((h) => h.scrollIntoViewIfNeeded());

  // Click text=Get Server Content in a IFrame Widget
  await page.click('text=Get Server Content in a IFrame Widget');

  // Wait for div[role="main"] >> text=Server Doc
  await page.waitForSelector('div[role="main"] >> text=Server Doc');

  expect(
    await page
      .frame({ url: /\/jlab-ext-example\/public\/index.html/ })
      .waitForSelector(
        'text=This content is served from the jlab_ext_example server extension.'
      )
  ).toBeTruthy();
});
