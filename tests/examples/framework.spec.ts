import { test, expect } from '@playwright/test';
import { projectConfig } from '../config/projectConfig';
import { readJsonTestData, readExcelTestData } from '../../fixtures/testData';

test.describe('Playwright framework setup', () => {
  test('loads test data from JSON and Excel files', async () => {
    const jsonData = readJsonTestData();
    const excelData = readExcelTestData();

    expect(jsonData.length).toBeGreaterThan(0);
    expect(excelData.length).toBeGreaterThan(0);
    expect(jsonData[0]).toHaveProperty('name');
    expect(excelData[0]).toHaveProperty('name');
  });

  test('opens Playwright docs and verifies the main heading', async ({ page }) => {
    await page.goto(projectConfig.uiBaseUrl);
    await expect(page.locator('h1').first()).toContainText(/Playwright/i);
  });

  test('calls the configured API successfully', async ({ request }) => {
    const response = await request.get(projectConfig.apiBaseUrl);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toHaveProperty('products');
    expect(body).toHaveProperty('responseCode', 200);
  });
});
