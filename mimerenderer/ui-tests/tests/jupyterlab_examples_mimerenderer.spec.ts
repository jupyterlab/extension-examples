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

  // Give the video a some time to load
  await page.waitForTimeout(500);

  expect(await view.screenshot()).toMatchSnapshot('mp4-file.png');
});
