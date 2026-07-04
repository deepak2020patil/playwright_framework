import { test, expect } from '../../fixtures/baseFixture';

test('login page smoke', async ({ homePage }) => {
  await homePage.open('https://playwright.dev/');
  const heading = await homePage.getHeadingText();
  expect(heading.toLowerCase()).toContain('playwright');
});
