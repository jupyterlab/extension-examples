import { test, expect } from '@jupyterlab/galata';

test('should open a log panel and filter message depending on the log level.', async ({
  page
}) => {
  // Click text=Examples
  await page.getByRole('menuitem', { name: 'Examples' }).click();

  // Click ul[role="menu"] >> text=Custom Log Console
  await page.getByRole('menuitem', { name: 'Custom Log Console' }).click();

  // Click div[role="main"] >> text=Log: custom-log-console
  expect(
    await page.waitForSelector(
      'div[role="main"] >> text=Log: custom-log-console'
    )
  ).toBeTruthy();

  // Click text=Examples menu
  await page.getByRole('menuitem', { name: 'Examples' }).click();
  // Click text=HTML log message
  await page.getByText('HTML Log Message').click();

  expect(await page.waitForSelector('text=Hello world HTML!!')).toBeTruthy();

  // Click text=Examples
  await page.getByRole('menuitem', { name: 'Examples' }).click();
  // Click text=Text log message
  await page.getByText('Text Log Message').click();

  expect(await page.waitForSelector('text=Hello world text!!')).toBeTruthy();

  // Click text=Examples
  await page.getByRole('menuitem', { name: 'Examples' }).click();
  // Click text=Output log message
  await page.getByText('Output Log Message').click();

  expect(
    await page.waitForSelector('text=Hello world nbformat!!')
  ).toBeTruthy();

  // Click button:has-text("Add Checkpoint")
  await page.click('button:has-text("Add Checkpoint")');

  expect(await page.waitForSelector('hr')).toBeTruthy();

  await page.click('button:has-text("Clear Log")');
  await page.waitForSelector('text=No log messages.');

  // Select warning
  await page.selectOption('[aria-label="Log level"]', 'warning');

  // Click text=Examples
  await page.getByRole('menuitem', { name: 'Examples' }).click();
  // Click text=Output log message
  await page.getByText('Output Log Message').click();

  expect(
    await page.waitForSelector('text=Hello world nbformat!!')
  ).toBeTruthy();

  // Click text=Examples
  await page.getByRole('menuitem', { name: 'Examples' }).click();
  // Click text=HTML log message
  await page.getByText('HTML Log Message').click();

  let failed = true;
  try {
    await page.waitForSelector('text=Hello world HTML!!', {
      state: 'attached',
      timeout: 200
    });
  } catch (e) {
    failed = false;
    expect(e).toBeTruthy();
  }
  expect(failed).toBe(false);

  // Select debug
  await page.selectOption('[aria-label="Log level"]', 'debug');

  // Click text=Examples
  await page.getByRole('menuitem', { name: 'Examples' }).click();
  // Click text=HTML log message
  await page.getByText('HTML Log Message').click();

  expect(await page.waitForSelector('text=Hello world HTML!!')).toBeTruthy();
});
