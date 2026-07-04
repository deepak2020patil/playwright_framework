import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { projectConfig } from '../config/projectConfig';
import { TestLogger } from '../../utils/testLogger';

test('common methods work for basic UI actions', async ({ page }) => {
  const logger = new TestLogger();
  const homePage = new HomePage(page);

  logger.write('Starting UI common methods test');
  await homePage.open(projectConfig.uiBaseUrl);
  logger.write(`Navigated to ${projectConfig.uiBaseUrl}`);

  const headingText = await homePage.getHeadingText();
  logger.write(`Heading text: ${headingText}`);
  expect(headingText.toLowerCase()).toContain('playwright');

  const href = await homePage.getBrandLinkHref();
  logger.write(`Home link href: ${href}`);
  expect(href).toContain('/');
});
