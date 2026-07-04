import { test, expect, ReportUtil } from '../../fixtures/reportFixture';
import { HomePage } from '../../pages/HomePage';
import { projectConfig } from '../config/projectConfig';
import { TraceUtil } from '../../utils/TraceUtil';
import { TestLogger } from '../../utils/testLogger';

test('trace configuration example - traces recorded and optionally attached to report', async ({
  page,
  testInfo,
}) => {
  const logger = new TestLogger();
  const homePage = new HomePage(page);

  logger.write('Step 1: Check trace configuration');
  logger.write(`Trace enabled: ${TraceUtil.isTraceEnabled()}`);
  logger.write(`Trace mode: ${TraceUtil.getTraceMode()}`);
  logger.write(`Trace attachments enabled: ${TraceUtil.isTraceAttachmentEnabled()}`);

  logger.write('Step 2: Navigate to homepage');
  await homePage.open(projectConfig.uiBaseUrl);
  logger.write(`Navigated to ${projectConfig.uiBaseUrl}`);

  logger.write('Step 3: Verify heading text');
  const headingText = await homePage.getHeadingText();
  expect(headingText.toLowerCase()).toContain('playwright');
  logger.write(`Heading text verified: ${headingText}`);

  logger.write('Step 4: Verify link href');
  const href = await homePage.getBrandLinkHref();
  expect(href).toContain('/');
  logger.write(`Home link href verified: ${href}`);

  logger.write('Step 5: Collect trace information');
  // In a real scenario, traces would be stored in test-results folder
  // and could be attached to the report if ENABLE_TRACE_ATTACHMENTS=true
  if (TraceUtil.isTraceAttachmentEnabled()) {
    logger.write('Trace attachments are enabled - traces will be added to report');
    // Traces are automatically added by Playwright based on TRACE_MODE setting
  } else {
    logger.write('Trace attachments disabled - traces stored in artifacts only');
  }

  logger.write('Test completed - trace recorded and available for analysis');
});
