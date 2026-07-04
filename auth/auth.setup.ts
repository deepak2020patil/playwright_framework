/** Framework created by Deepak Patil <deepakpatil.slk@gmail.com> */import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://playwright.dev/');
  await page.context().storageState({ path: 'storage/state.json' });
  await browser.close();
}

export default globalSetup;

