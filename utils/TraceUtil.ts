/** Framework created by Deepak Patil <deepakpatil.slk@gmail.com> */import fs from 'fs';
import path from 'path';
import { projectConfig } from '../tests/config/projectConfig';

export class TraceUtil {
  /**
   * Get the trace output directory for the current test run
   * Traces are stored in test-results/test_XXXX/artifacts/
   */
  static getTraceDir(): string {
    // This would be called from within a test context
    // For now, return a default path
    return path.resolve(projectConfig.outputFolder, 'traces');
  }

  /**
   * Check if trace recording is enabled
   */
  static isTraceEnabled(): boolean {
    return projectConfig.traceMode !== 'off';
  }

  /**
   * Get the configured trace mode
   * Accepted values: 'on' | 'off' | 'on-first-retry' | 'retain-on-failure'
   */
  static getTraceMode(): string {
    return projectConfig.traceMode;
  }

  /**
   * Check if trace attachments to report are enabled
   */
  static isTraceAttachmentEnabled(): boolean {
    return projectConfig.enableTraceAttachments;
  }

  /**
   * Get list of trace files from directory
   */
  static getTraceFiles(directory: string): string[] {
    try {
      if (!fs.existsSync(directory)) {
        return [];
      }

      return fs
        .readdirSync(directory)
        .filter((file) => file.endsWith('.zip'))
        .map((file) => path.join(directory, file));
    } catch (error) {
      console.warn(`Failed to list trace files: ${error}`);
      return [];
    }
  }

  /**
   * Clean up old trace files (older than specified hours)
   * @param directory - Directory containing trace files
   * @param hoursOld - Delete traces older than this many hours (default: 24)
   */
  static cleanupOldTraces(directory: string, hoursOld: number = 24): number {
    try {
      if (!fs.existsSync(directory)) {
        return 0;
      }

      const cutoffTime = Date.now() - hoursOld * 60 * 60 * 1000;
      const files = fs.readdirSync(directory);
      let deletedCount = 0;

      files.forEach((file) => {
        if (file.endsWith('.zip')) {
          const filePath = path.join(directory, file);
          const stats = fs.statSync(filePath);
          if (stats.mtimeMs < cutoffTime) {
            fs.unlinkSync(filePath);
            deletedCount++;
          }
        }
      });

      return deletedCount;
    } catch (error) {
      console.warn(`Failed to cleanup old traces: ${error}`);
      return 0;
    }
  }
}

