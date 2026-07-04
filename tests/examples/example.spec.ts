/** Framework created by Deepak Patil <deepakpatil.slk@gmail.com> */import { test, expect } from '@playwright/test';
import { projectConfig } from '../config/projectConfig';

test('UI example - Playwright homepage loads', async ({ page }) => {
  await page.goto(projectConfig.uiBaseUrl);
  await expect(page).toHaveTitle(/Playwright/);
  await expect(page.locator('h1')).toContainText(/Playwright/i);
});

test('API example - products list returns success', async ({ request }) => {
  const response = await request.get(projectConfig.apiBaseUrl);

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body).toHaveProperty('products');
});

