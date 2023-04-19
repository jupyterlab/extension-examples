import { test, expect } from '@jupyterlab/galata';

test.use({ autoGoto: false });

test('should store state between reloads', async ({ page }) => {
  await Promise.all([
    page.waitForRequest(
      request =>
        request.url().search('jupyterlab-examples-server/hello') >= 0 &&
        request.method() === 'GET'
    ),
    page.waitForRequest(
      request =>
        request.url().search('/jupyterlab-examples-server/hello') >= 0 &&
        request.method() === 'POST' &&
        request.postDataJSON()?.name === 'George'
    ),
    page.goto()
  ]);

  await page.waitForSelector('div[role="main"] >> text=Launcher');

  await page
    .waitForSelector('text=Get Server Content in a IFrame Widget')
    .then(h => h.scrollIntoViewIfNeeded());

  // Click the launcher widget to open an IFrame Widget
  await page.click('text=Get Server Content in a IFrame Widget');

  // Wait for div[role="main"] >> text=Server Doc
  await page.waitForSelector('div[role="main"] >> text=Server Doc');

  expect(
    await page
      .frame({ url: '/jupyterlab-examples-server/public/index.html' })
      ?.waitForSelector(
        'text=This content is served from the jupyterlab_examples_server extension.'
      )
  ).toBeTruthy();
});
