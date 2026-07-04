/** Framework created by Deepak Patil <deepakpatil.slk@gmail.com> */
import { test, expect } from '@playwright/test';
import path from 'path';
import { HomePage } from '../../pages/HomePage';
import { projectConfig } from '../config/projectConfig';
import { ScreenshotUtil } from '../../utils/ScreenshotUtil';
import { VideoUtil, StepVideoSession } from '../../utils/VideoUtil';
import { TraceUtil } from '../../utils/TraceUtil';
import { TestLogger } from '../../utils/testLogger';

async function captureStepScreenshot(page: any, stepName: string): Promise<string> {
  const fileName = `step-${stepName}-${Date.now()}.png`;
  await ScreenshotUtil.capture(page, fileName, true);
  return path.resolve('screenshots', fileName);
}

test('UI example - screenshots, video and traces enabled', async ({ browser }, testInfo) => {
  const logger = new TestLogger();

  logger.write('UI Step 1: Start step video recording');
  const uiSession: StepVideoSession | null = await VideoUtil.startStepRecording(browser, 'ui-navigation');
  expect(uiSession).not.toBeNull();
  const uiPage = uiSession!.page;
  const homePage = new HomePage(uiPage);

  await uiPage.goto(projectConfig.uiBaseUrl);
  const uiScreenshotPath = await captureStepScreenshot(uiPage, 'ui-navigation');
  await testInfo.attach('ui-navigation-screenshot', {
    path: uiScreenshotPath,
    contentType: 'image/png',
  });

  const headingText = await homePage.getHeadingText();
  expect(headingText.toLowerCase()).toContain('playwright');
  logger.write(`UI heading validated: ${headingText}`);

  const uiVideoPath = await VideoUtil.stopStepRecording(uiSession!);
  expect(uiVideoPath).toBeTruthy();
  await testInfo.attach('ui-navigation-video', {
    path: uiVideoPath!,
    contentType: 'video/webm',
  });
  logger.write(`UI navigation video saved: ${uiVideoPath}`);

  logger.write('UI Step 2: Validate trace configuration');
  expect(TraceUtil.isTraceEnabled()).toBeTruthy();
  expect(TraceUtil.getTraceMode()).toBe(projectConfig.traceMode);
  expect(TraceUtil.isTraceAttachmentEnabled()).toBe(projectConfig.enableTraceAttachments);

  const traceFiles = TraceUtil.getTraceFiles(TraceUtil.getTraceDir());
  if (traceFiles.length > 0 && projectConfig.enableTraceAttachments) {
    for (const traceFile of traceFiles) {
      await testInfo.attach(path.basename(traceFile, '.zip'), {
        path: traceFile,
        contentType: 'application/zip',
      });
    }
  }

  logger.write('UI example completed successfully');
});

test('API example - API endpoint validation with screenshot', async ({ browser, request }, testInfo) => {
  const logger = new TestLogger();

  logger.write('API Step 1: Send request to API endpoint');
  const apiResponse = await request.get(projectConfig.apiBaseUrl);
  expect(apiResponse.ok()).toBeTruthy();
  logger.write(`API status: ${apiResponse.status()}`);

  const apiPage = await browser.newPage();
  await apiPage.goto('about:blank');
  const apiScreenshotPath = await captureStepScreenshot(apiPage, 'api-call');
  await testInfo.attach('api-call-screenshot', {
    path: apiScreenshotPath,
    contentType: 'image/png',
  });
  await apiPage.close();

  logger.write('API example completed successfully');
});
