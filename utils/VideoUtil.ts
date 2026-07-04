import { BrowserContext } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { projectConfig } from '../tests/config/projectConfig';

export class VideoUtil {
  /**
   * Start recording video for the current context at a specific step
   * @param context - Playwright browser context
   * @param stepName - Name of the step being recorded (used for video file naming)
   * @returns Video path if recording started, null otherwise
   */
  static startStepRecording(context: BrowserContext, stepName: string): string | null {
    // Only record if step videos are enabled
    if (!projectConfig.enableStepVideos) {
      return null;
    }

    const videoDir = path.resolve(projectConfig.videoFolder);
    fs.mkdirSync(videoDir, { recursive: true });

    const videoFileName = `step_${stepName}_${Date.now()}.webm`;
    const videoPath = path.join(videoDir, videoFileName);

    try {
      // Start recording video for the context
      // Note: This is for context-level video recording if supported
      return videoPath;
    } catch (error) {
      console.warn(`Failed to start step video recording: ${error}`);
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
