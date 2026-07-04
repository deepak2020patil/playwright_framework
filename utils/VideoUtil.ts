/** Framework created by Deepak Patil <deepakpatil.slk@gmail.com> */import { Browser, BrowserContext, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { projectConfig } from '../tests/config/projectConfig';

export type StepVideoSession = {
  context: BrowserContext;
  page: Page;
  stepName: string;
};

export class VideoUtil {
  /**
   * Start recording a step-level video in a new temporary browser context.
   * @param browser - Playwright browser object
   * @param stepName - Name of the step being recorded
   * @returns StepVideoSession if recording starts successfully, null otherwise
   */
  static async startStepRecording(browser: Browser, stepName: string): Promise<StepVideoSession | null> {
    if (!projectConfig.enableStepVideos) {
      return null;
    }

    const videoDir = path.resolve(projectConfig.videoFolder);
    fs.mkdirSync(videoDir, { recursive: true });

    try {
      const stepContext = await browser.newContext({
        recordVideo: {
          dir: videoDir,
          size: { width: 1280, height: 720 },
        },
      });
      const stepPage = await stepContext.newPage();
      return {
        context: stepContext,
        page: stepPage,
        stepName,
      };
    } catch (error) {
      console.warn(`Failed to start step video recording: ${error}`);
      return null;
    }
  }

  /**
   * Stop recording a step-level video and return the saved file path.
   */
  static async stopStepRecording(session: StepVideoSession): Promise<string | null> {
    if (!session) {
      return null;
    }

    try {
      const video = session.page.video();
      await session.page.close();
      const originalVideoPath = video ? await video.path() : null;
      await session.context.close();

      if (!originalVideoPath || !fs.existsSync(originalVideoPath)) {
        return null;
      }

      const videoDir = path.dirname(originalVideoPath);
      const renamedVideoPath = path.join(
        videoDir,
        `step_${session.stepName}_${Date.now()}.webm`
      );
      fs.renameSync(originalVideoPath, renamedVideoPath);
      return renamedVideoPath;
    } catch (error) {
      console.warn(`Failed to stop step video recording: ${error}`);
      return null;
    }
  }

  /**
   * Check if step videos are enabled in config
   */
  static isStepVideosEnabled(): boolean {
    return projectConfig.enableStepVideos;
  }

  /**
   * Get the configured video folder path
   */
  static getVideoFolder(): string {
    return projectConfig.videoFolder;
  }

  /**
   * Get list of recorded step videos
   */
  static getStepVideos(): string[] {
    try {
      const videoDir = projectConfig.videoFolder;
      if (!fs.existsSync(videoDir)) {
        return [];
      }

      return fs
        .readdirSync(videoDir)
        .filter((file) => file.startsWith('step_') && file.endsWith('.webm'))
        .map((file) => path.join(videoDir, file));
    } catch (error) {
      console.warn(`Failed to list step videos: ${error}`);
      return [];
    }
  }

  /**
   * Clean up step videos (older than specified hours)
   * @param hoursOld - Delete videos older than this many hours (default: 24)
   */
  static cleanupOldStepVideos(hoursOld: number = 24): number {
    try {
      const videoDir = projectConfig.videoFolder;
      if (!fs.existsSync(videoDir)) {
        return 0;
      }

      const cutoffTime = Date.now() - hoursOld * 60 * 60 * 1000;
      const files = fs.readdirSync(videoDir);
      let deletedCount = 0;

      files.forEach((file) => {
        if (file.startsWith('step_') && file.endsWith('.webm')) {
          const filePath = path.join(videoDir, file);
          const stats = fs.statSync(filePath);
          if (stats.mtimeMs < cutoffTime) {
            fs.unlinkSync(filePath);
            deletedCount++;
          }
        }
      });

      return deletedCount;
    } catch (error) {
      console.warn(`Failed to cleanup old step videos: ${error}`);
      return 0;
    }
  }
}

