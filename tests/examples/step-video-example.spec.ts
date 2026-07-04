import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { projectConfig } from '../config/projectConfig';
import { VideoUtil } from '../../utils/VideoUtil';
import { TestLogger } from '../../utils/testLogger';

test('step video example - enables conditional video recording at steps', async ({ page, context }) => {
  const logger = new TestLogger();
  const homePage = new HomePage(page);

  logger.write('Step 1: Check if step videos are enabled');
  logger.write(`Step videos enabled: ${VideoUtil.isStepVideosEnabled()}`);
  logger.write(`Video folder: ${VideoUtil.getVideoFolder()}`);

  logger.write('Step 2: Navigating to homepage');
  // Could start recording here if implementing custom recording logic
  const videoPath1 = VideoUtil.startStepRecording(context, 'navigation');
  if (videoPath1) {
    logger.write(`Recording video to: ${videoPath1}`);
  }

  await homePage.open(projectConfig.uiBaseUrl);
  logger.write(`Navigated to ${projectConfig.uiBaseUrl}`);

  logger.write('Step 3: Getting heading text');
  // Get step videos list before this action
  const videosBeforeHeading = VideoUtil.getStepVideos();
  logger.write(`Step videos captured so far: ${videosBeforeHeading.length}`);

  const headingText = await homePage.getHeadingText();
  logger.write(`Heading text: ${headingText}`);
  expect(headingText.toLowerCase()).toContain('playwright');

  logger.write('Step 4: Getting brand link href');
  const videoPath2 = VideoUtil.startStepRecording(context, 'link-check');
  if (videoPath2) {
    logger.write(`Recording video to: ${videoPath2}`);
  }

  const href = await homePage.getBrandLinkHref();
  logger.write(`Home link href: ${href}`);
  expect(href).toContain('/');

  logger.write('Test completed successfully');

  logger.write('Step 5: Check final video collection');
  const finalVideos = VideoUtil.getStepVideos();
  logger.write(`Total step videos: ${finalVideos.length}`);
  if (finalVideos.length > 0) {
    finalVideos.forEach((video) => {
      logger.write(`  - ${video}`);
    });
  }
});
