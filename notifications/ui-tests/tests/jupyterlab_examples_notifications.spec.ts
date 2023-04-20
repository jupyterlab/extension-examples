import { expect, test } from '@jupyterlab/galata';

test('should display notifications', async ({ page }) => {
  // Click the menu entry
  await page.menu.clickMenuItem('Notification Example>Display notifications');

  const notifications = page.getByRole('alert');
  await expect.soft(notifications).toHaveCount(2);
  await expect
    .soft(notifications.last())
    .toHaveText(/Watch out something went wrong./);
  await expect.soft(notifications.first()).toHaveText('Waiting...');

  await expect
    .soft(notifications.last())
    .toHaveText('Action successful after 2000ms.');

  await page.getByTitle('3 notifications').click();

  expect(
    await page
      .locator('.jp-Notification-Center')
      .screenshot({ animations: 'disabled' })
  ).toMatchSnapshot('notifications.png');

  let alert = false;
  page.once('dialog', dialog => {
    expect.soft(dialog.message()).toEqual('This was a fake error.');
    alert = true;
    dialog.accept();
  });
  await page
    .locator('.jp-Notification-Center')
    .getByRole('button', { name: 'Help' })
    .click();

  expect(alert).toBeTruthy();
});
