import { test, expect } from '@playwright/test';

test('users api smoke', async ({ request }) => {
  const response = await request.get('https://automationexercise.com/api/productsList');
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
});
