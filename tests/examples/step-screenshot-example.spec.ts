/** Framework created by Deepak Patil <deepakpatil.slk@gmail.com> */import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { projectConfig } from '../config/projectConfig';
import { ScreenshotUtil } from '../../utils/ScreenshotUtil';
import { TestLogger } from '../../utils/testLogger';

test('step screenshot example - takes screenshots at each step when enabled', async ({ page }) => {
  const logger = new TestLogger();
  const homePage = new HomePage(page);

  logger.write('Step 1: Navigating to homepage');
  await homePage.open(projectConfig.uiBaseUrl);
  // This screenshot will only be taken if ENABLE_STEP_SCREENSHOTS=true
  await ScreenshotUtil.capture(page, '01-after-navigation.png');

  logger.write('Step 2: Getting heading text');
  const headingText = await homePage.getHeadingText();
  // Optional: force capture regardless of config
  await ScreenshotUtil.capture(page, '02-after-heading-check.png', true);
  logger.write(`Heading text: ${headingText}`);
  expect(headingText.toLowerCase()).toContain('playwright');

  logger.write('Step 3: Getting brand link href');
  const href = await homePage.getBrandLinkHref();
  // This screenshot will only be taken if ENABLE_STEP_SCREENSHOTS=true
  await ScreenshotUtil.capture(page, '03-after-link-check.png');
  logger.write(`Home link href: ${href}`);
  expect(href).toContain('/');

  logger.write('Test completed successfully');
});

