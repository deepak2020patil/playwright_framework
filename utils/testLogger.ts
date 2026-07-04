import fs from 'fs';
import path from 'path';
import { getRunFolderName, projectConfig } from '../tests/config/projectConfig';

export class TestLogger {
  private logFilePath: string;

  constructor() {
    const baseDir = path.resolve(projectConfig.outputFolder);
    const runDir = path.join(baseDir, getRunFolderName(), 'artifacts');

    if (!fs.existsSync(runDir)) {
      fs.mkdirSync(runDir, { recursive: true });
    }

    this.logFilePath = path.join(runDir, projectConfig.logFileName);
  }

  write(message: string) {
    const entry = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFileSync(this.logFilePath, entry, 'utf8');
    console.log(message);
  }
}
