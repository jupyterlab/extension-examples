import { test, expect } from '@jupyterlab/galata';

test('should capture log messages in dedicated panel', async ({ page }) => {
  // Open a new Notebook
  await page.menu.clickMenuItem('File>New>Notebook');
  // Click button:has-text("Select")
  await page.click('button:has-text("Select")');

  // Open the console
  await page.menu.clickMenuItem('View>Show Log Console');

  // Drag and drop the split to display a bigger log panel.
  // const splitHandle = await page.$('div.lm-SplitPanel-handle');
  const splitHandle = await page.$(
    '#jp-main-split-panel > div.lm-SplitPanel-handle:not(.lm-mod-hidden)'
  );
  const splitHandleBBox = await splitHandle!.boundingBox();
  await page.mouse.move(
    splitHandleBBox!.x + 0.5 * splitHandleBBox!.width,
    splitHandleBBox!.y + 0.5 + splitHandleBBox!.height
  );
  await page.mouse.down();
  await page.mouse.move(
    splitHandleBBox!.x + 0.5 * splitHandleBBox!.width,
    splitHandleBBox!.y + 0.5 + splitHandleBBox!.height - 200
  );
  await page.mouse.up();

  await page.pause();

  // Click the log message menu entry
  await page.menu.clickMenuItem('Log Messages Example>Text log message');

  let failed = true;
  try {
    await page.waitForSelector('text=Hello world text!!', { timeout: 200 });
  } catch (e) {
    failed = false;
    expect(e).toBeTruthy();
  }
  expect(failed).toBe(false);

  // Select debug
  await page.selectOption('[aria-label="Log level"]', 'debug');
  // Click the log message menu entry
  await page.menu.clickMenuItem('Log Messages Example>Text log message');

  expect(await page.waitForSelector('text=Hello world text!!')).toBeTruthy();

  // Click button:has-text("Clear Log")
  await page.click('button:has-text("Clear Log")');

  failed = true;
  try {
    await page.waitForSelector('text=Hello world text!!', { timeout: 200 });
    throw new Error('Log messages were not cleared.');
  } catch (e) {
    failed = false;
    expect(e).toBeTruthy();
  }
  expect(failed).toBe(false);
});
