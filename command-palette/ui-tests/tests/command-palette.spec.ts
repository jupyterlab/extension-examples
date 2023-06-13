import { test, expect } from '@jupyterlab/galata';

test.use({ autoGoto: false });

test('should emit console message when called from palette', async ({
  page
}) => {
  const logs: string[] = [];

  page.on('console', message => {
    logs.push(message.text());
  });

  await page.goto();

  // Click text=View
  await page.click('text=View');
  // Click text=Activate Command Palette
  await page.click('text=Activate Command Palette');
  // Fill [aria-label="Command Palette Section"] [placeholder="SEARCH"]
  await page.fill(
    '[aria-label="Command Palette Section"] [placeholder="SEARCH"]',
    'Execute'
  );
  // Click text=Execute jlab-examples:command-palette Command
  await page.click('text=Execute jlab-examples:command-palette Command');

  expect(
    logs.filter(s =>
      s.startsWith('jlab-examples:command-palette has been called from palette')
    )
  ).toHaveLength(1);
});
