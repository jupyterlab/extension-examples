import * as path from 'path';

import { expect, test } from '@jupyterlab/galata';

test('should display mp4 data file', async ({ page, tmpPath }) => {
  const filename = 'keaton.mp4';

<<<<<<< before updating
  await page.contents.uploadFile(
    path.resolve(__dirname, '../../keaton.mp4'),
    `${tmpPath}/${filename}`
  );
=======
  await page.getByRole('button', { name: 'Rename' }).click();
  await page.waitForTimeout(200);
>>>>>>> after updating

  // Close file opened as editor
  await page.activity.closePanel('test.my_type');

  await page.filebrowser.open(filename);

  const view = page.getByRole('main').locator('.mimerenderer-mp4');

  expect(await view.screenshot()).toMatchSnapshot('mp4-file.png');
});
