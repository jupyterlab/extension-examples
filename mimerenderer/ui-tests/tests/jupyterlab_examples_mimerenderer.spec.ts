import * as path from 'path';

import { expect, test } from '@jupyterlab/galata';

test('should display mp4 data file', async ({ page, tmpPath }) => {
  const filename = 'keaton.mp4';

  await page.contents.uploadFile(
    path.resolve(__dirname, '../../keaton.mp4'),
    tmpPath
  );

  await page.filebrowser.open(filename);

  const view = page.getByRole('main').locator('.mimerenderer-mp4');

  expect(await view.screenshot()).toMatchSnapshot('mp4-file.png');
});

test.skip('should display notebook mp4 output', async ({ page }) => {
  await page.menu.clickMenuItem('File>New>Notebook');

  await page.getByRole('button', { name: 'Select' }).click();

  await page.notebook.setCell(
    0,
    'code',
    `from IPython.display import display
# Example of MIME type content
output = {
    "video/mp4": ""
}

display(output, raw=True)`
  );

  await page.notebook.run();

  const outputs = page
    .getByRole('main')
    .locator('.mimerenderer-mp4.jp-OutputArea-output');

  await expect(outputs).toHaveCount(1);
});
