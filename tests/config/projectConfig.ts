import fs from 'fs';
import path from 'path';

export const projectConfig = {
  projectName: process.env.PROJECT_NAME || 'amazon_UI_API_project',
  outputFolder: process.env.OUTPUT_FOLDER || 'test-results',
  logFileName: process.env.LOG_FILE_NAME || 'execution.log',
  screenshotMode: process.env.SCREENSHOT_MODE || 'only-on-failure',
  videoMode: process.env.VIDEO_MODE || 'retain-on-failure',
  videoFolder: process.env.VIDEO_FOLDER || path.resolve(process.cwd(), 'videos'),
  uiBaseUrl: process.env.UI_BASE_URL || 'https://playwright.dev/',
  apiBaseUrl: process.env.API_BASE_URL || 'https://automationexercise.com/api/productsList',
};

export type ProxyConfig = {
  httpProxy?: string;
  httpsProxy?: string;
  username?: string;
  password?: string;
};

export function loadProxyConfig(): ProxyConfig {
  const proxyFilePath = path.resolve(process.cwd(), 'proxy-config.json');

  if (!fs.existsSync(proxyFilePath)) {
    return {};
  }

  try {
    const raw = fs.readFileSync(proxyFilePath, 'utf8');
    const parsed = JSON.parse(raw) as ProxyConfig;
    return {
      httpProxy: parsed.httpProxy || process.env.HTTP_PROXY || process.env.http_proxy || '',
      httpsProxy: parsed.httpsProxy || process.env.HTTPS_PROXY || process.env.https_proxy || '',
      username: parsed.username || process.env.PROXY_USERNAME || '',
      password: parsed.password || process.env.PROXY_PASSWORD || '',
    };
  } catch {
    return {};
  }
}

export function getRunFolderName(): string {
  if (process.env.PLAYWRIGHT_RUN_ID) {
    return process.env.PLAYWRIGHT_RUN_ID;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const runFolderName = `test_${timestamp}_${projectConfig.projectName}`;
  process.env.PLAYWRIGHT_RUN_ID = runFolderName;
  return runFolderName;
}
