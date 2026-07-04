import { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export class ScreenshotUtil {
  static async capture(page: Page, fileName: string) {
    const dir = path.resolve('screenshots');
    fs.mkdirSync(dir, { recursive: true });
    await page.screenshot({ path: path.join(dir, fileName), fullPage: true });
  }
}
