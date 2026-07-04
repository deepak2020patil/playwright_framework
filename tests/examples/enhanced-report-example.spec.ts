/** Framework created by Deepak Patil <deepakpatil.slk@gmail.com> */import { test, expect, ReportUtil } from '../../fixtures/reportFixture';
import { HomePage } from '../../pages/HomePage';
import { projectConfig } from '../config/projectConfig';
import { ScreenshotUtil } from '../../utils/ScreenshotUtil';
import { VideoUtil } from '../../utils/VideoUtil';
import { TestLogger } from '../../utils/testLogger';

test('enhanced report - step screenshots and videos attached to HTML report', async ({
  page,
  testInfo,
}) => {
  const logger = new TestLogger();
  const homePage = new HomePage(page);

  logger.write('Step 1: Navigate to homepage');
  await homePage.open(projectConfig.uiBaseUrl);
  // Capture and attach screenshot to report
  await ReportUtil.captureAndAttachScreenshot(testInfo, page, 'step-01-navigation');
  logger.write('Screenshot attached: step-01-navigation');

  logger.write('Step 2: Verify heading text');
  const headingText = await homePage.getHeadingText();
  expect(headingText.toLowerCase()).toContain('playwright');
  // Attach screenshot after verification
  await ReportUtil.captureAndAttachScreenshot(testInfo, page, 'step-02-heading-verified');
  logger.write('Screenshot attached: step-02-heading-verified');
  logger.write(`Heading text: ${headingText}`);

  logger.write('Step 3: Get brand link href');
  const href = await homePage.getBrandLinkHref();
  expect(href).toContain('/');
  // Attach screenshot after link verification
  await ReportUtil.captureAndAttachScreenshot(testInfo, page, 'step-03-link-verified');
  logger.write('Screenshot attached: step-03-link-verified');
  logger.write(`Home link href: ${href}`);

  logger.write('Step 4: Verify video mode');
  if (VideoUtil.isStepVideosEnabled()) {
    logger.write('Step videos enabled - videos will be in report');
    // Get all step videos
    const stepVideos = VideoUtil.getStepVideos();
    logger.write(`Found ${stepVideos.length} step videos`);

    // Attach all step videos to report
    await ReportUtil.attachVideos(testInfo, projectConfig.videoFolder, 'step_');
  }

  logger.write('Test completed - all steps attached to HTML report');
});

