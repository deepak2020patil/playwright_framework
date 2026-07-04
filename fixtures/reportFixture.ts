import { test as base, expect, TestInfo } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export type ReportEnhancements = {
  testInfo: TestInfo;
};

export const test = base.extend<ReportEnhancements>({
  testInfo: async ({}, use, testInfo) => {
    await use(testInfo);
  },
});

/**
 * Utility class to enhance HTML report with screenshots and videos
 */
export class ReportUtil {
  /**
   * Attach screenshot to test report
   * @param testInfo - Playwright TestInfo object
   * @param screenshotPath - Path to screenshot file
   * @param label - Label for the screenshot attachment
   */
  static async attachScreenshot(testInfo: TestInfo, screenshotPath: string, label: string = 'screenshot') {
    if (fs.existsSync(screenshotPath)) {
      await testInfo.attach(label, {
        path: screenshotPath,
        contentType: 'image/png',
      });
    }
  }

  /**
   * Attach multiple screenshots to test report
   * @param testInfo - Playwright TestInfo object
   * @param screenshotDirectory - Directory containing screenshots
   * @param prefix - Prefix to filter screenshots (e.g., "step_")
   */
  static async attachScreenshots(testInfo: TestInfo, screenshotDirectory: string, prefix: string = '') {
    if (!fs.existsSync(screenshotDirectory)) {
      return;
    }

    const files = fs
      .readdirSync(screenshotDirectory)
      .filter((f) => f.endsWith('.png') && (prefix ? f.startsWith(prefix) : true))
      .sort();

    for (const file of files) {
      const filePath = path.join(screenshotDirectory, file);
      await testInfo.attach(file.replace('.png', ''), {
        path: filePath,
        contentType: 'image/png',
      });
    }
  }

  /**
   * Attach video to test report
   * @param testInfo - Playwright TestInfo object
   * @param videoPath - Path to video file
   * @param label - Label for the video attachment
   */
  static async attachVideo(testInfo: TestInfo, videoPath: string, label: string = 'video') {
    if (fs.existsSync(videoPath)) {
      await testInfo.attach(label, {
        path: videoPath,
        contentType: 'video/webm',
      });
    }
  }

  /**
   * Attach step-level videos to test report
   * @param testInfo - Playwright TestInfo object
   * @param videoDirectory - Directory containing videos
   * @param prefix - Prefix to filter videos (e.g., "step_")
   */
  static async attachVideos(testInfo: TestInfo, videoDirectory: string, prefix: string = 'step_') {
    if (!fs.existsSync(videoDirectory)) {
      return;
    }

    const files = fs
      .readdirSync(videoDirectory)
      .filter((f) => f.endsWith('.webm') && (prefix ? f.startsWith(prefix) : true))
      .sort();

    for (const file of files) {
      const filePath = path.join(videoDirectory, file);
      await testInfo.attach(file.replace('.webm', ''), {
        path: filePath,
        contentType: 'video/webm',
      });
    }
  }

  /**
   * Attach step screenshot with conditional logic
   * @param testInfo - Playwright TestInfo object
   * @param page - Playwright page object
   * @param label - Label for the screenshot
   * @param screenshotDir - Directory to save screenshot
   */
  static async captureAndAttachScreenshot(
    testInfo: TestInfo,
    page: any,
    label: string,
    screenshotDir: string = 'screenshots'
  ) {
    const fileName = `${label}-${Date.now()}.png`;
    const filePath = path.join(screenshotDir, fileName);

    // Create directory if it doesn't exist
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // Capture screenshot
    await page.screenshot({ path: filePath, fullPage: true });

    // Attach to report
    await testInfo.attach(label, {
      path: filePath,
      contentType: 'image/png',
    });
  }

  /**
   * Attach trace file to test report
   * @param testInfo - Playwright TestInfo object
   * @param tracePath - Path to trace file (.zip)
   * @param label - Label for the trace attachment
   */
  static async attachTrace(testInfo: TestInfo, tracePath: string, label: string = 'trace') {
    if (fs.existsSync(tracePath)) {
      await testInfo.attach(label, {
        path: tracePath,
        contentType: 'application/zip',
      });
    }
  }

  /**
   * Attach all trace files from directory to test report
   * @param testInfo - Playwright TestInfo object
   * @param traceDirectory - Directory containing trace files
   */
  static async attachTraces(testInfo: TestInfo, traceDirectory: string) {
    if (!fs.existsSync(traceDirectory)) {
      return;
    }

    const files = fs
      .readdirSync(traceDirectory)
      .filter((f) => f.endsWith('.zip'))
      .sort();

    for (const file of files) {
      const filePath = path.join(traceDirectory, file);
      await testInfo.attach(file.replace('.zip', ''), {
        path: filePath,
        contentType: 'application/zip',
      });
    }
  }
}

export { expect } from '@playwright/test';
