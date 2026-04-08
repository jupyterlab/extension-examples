import { test, expect } from '@jupyterlab/galata';

test('should capture log messages in dedicated panel', async ({ page }) => {
  // Open a new Notebook
  await page.notebook.createNew();
  await page
    .locator('.jp-Notebook-ExecutionIndicator[data-status="idle"]')
    .waitFor();

  const logPanel = page.locator('.jp-LogConsolePanel');
  if (!(await logPanel.isVisible())) {
    const activated = await page.activity.activateTab(/Log Console/);
    if (!activated) {
      await page.menu.clickMenuItem('View>Show Log Console');
      await page.activity.activateTab(/Log Console/);
    }
  }
  await expect(logPanel).toBeVisible();

  // Drag and drop the split to display a bigger log panel.
  const splitHandle = page.locator(
    '#jp-main-split-panel > div.lm-SplitPanel-handle:not(.lm-mod-hidden)'
  );
  await expect(splitHandle).toBeVisible();
  const splitHandleBBox = await splitHandle.boundingBox();
  if (!splitHandleBBox) {
    throw new Error('Could not determine the split handle position.');
  }
  await page.mouse.move(
    splitHandleBBox.x + 0.5 * splitHandleBBox.width,
    splitHandleBBox.y + 0.5 + splitHandleBBox.height
  );
  await page.mouse.down();
  await page.mouse.move(
    splitHandleBBox.x + 0.5 * splitHandleBBox.width,
    splitHandleBBox.y + 0.5 + splitHandleBBox.height - 200
  );
  await page.mouse.up();

  const messageOutput = logPanel.getByText('Hello world text!!');
  await expect(messageOutput).toHaveCount(0);

  // Click the log message menu entry
  await page.menu.clickMenuItem('Log Messages Example>Text log message');

  // Default level is higher than "info", so the text should stay hidden.
  await expect(messageOutput).toHaveCount(0);

  // Select debug
  await page.selectOption('[aria-label="Log level"]', 'debug');
  // Click the log message menu entry
  await page.menu.clickMenuItem('Log Messages Example>Text log message');

  await expect(messageOutput.first()).toBeVisible();

  const clearLogButton = page.getByRole('button', { name: 'Clear Log' });
  await expect(clearLogButton).toBeVisible();
  await clearLogButton.click();

  await expect(messageOutput).toHaveCount(0);
});
