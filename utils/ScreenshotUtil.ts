import { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { projectConfig } from '../tests/config/projectConfig';

export class ScreenshotUtil {
  /**
   * Capture screenshot with conditional logic based on config
   * @param page - Playwright page object
   * @param fileName - Name of the screenshot file
   * @param forceCapture - Force capture regardless of config setting (default: false)
   */
  static async capture(page: Page, fileName: string, forceCapture: boolean = false) {
    // Only capture if step screenshots are enabled or force flag is set
    if (!projectConfig.enableStepScreenshots && !forceCapture) {
      return;
    }

    const dir = path.resolve('screenshots');
    fs.mkdirSync(dir, { recursive: true });
    await page.screenshot({ path: path.join(dir, fileName), fullPage: true });
  }

  /**
   * Check if step screenshots are enabled in config
   */
  static isStepScreenshotsEnabled(): boolean {
    return projectConfig.enableStepScreenshots;
  }
}
