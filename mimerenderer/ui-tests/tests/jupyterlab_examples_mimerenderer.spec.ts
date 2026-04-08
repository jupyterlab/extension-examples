import * as path from 'path';

import { expect, test } from '@jupyterlab/galata';

test('should display mp4 data file', async ({ page, tmpPath }) => {
  const filename = 'keaton.mp4';

  await page.contents.uploadFile(
    path.resolve(__dirname, '../../keaton.mp4'),
    `${tmpPath}/${filename}`
  );

  // Close file opened as editor
  await page.activity.closePanel('test.my_type');

  await page.filebrowser.open(filename);

  const view = page.getByRole('main').locator('.mimerenderer-mp4');
  const video = view.locator('video');

  await expect(view).toBeVisible();
  await expect(video).toBeVisible();

  await expect
    .poll(
      async () =>
        await video.evaluate(node => (node as HTMLVideoElement).readyState)
    )
    .toBeGreaterThanOrEqual(2);

  await expect
    .poll(
      async () =>
        await video.evaluate(node =>
          (node as HTMLVideoElement).src.startsWith('data:video/mp4;base64,')
        )
    )
    .toBe(true);
});
