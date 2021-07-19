import { test, expect } from '@playwright/test';

const TARGET_URL = process.env.TARGET_URL ?? 'http://localhost:8888';

test('should add a card to create Python file', async ({ page }) => {
  await page.goto(`${TARGET_URL}/lab`);
  await page.waitForSelector('#jupyterlab-splash', { state: 'detached' });
  await page.waitForSelector('div[role="main"] >> text=Launcher');

  // Scroll to the new card
  await page.focus('text=Extension ExamplesPython File >> p');

  await page.click('text=Extension ExamplesPython File >> p');

  // Click div[role="main"] >> text=untitled.py
  await page.click('div[role="main"] >> text=untitled.py');
});
