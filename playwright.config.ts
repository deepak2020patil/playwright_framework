import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { getRunFolderName, loadProxyConfig, projectConfig } from './tests/config/projectConfig';

const isCI = Boolean(process.env.CI);
const baseURL = process.env.BASE_URL || 'https://playwright.dev';
const hubURL = process.env.HUB_URL || '';
const runInRemoteGrid = Boolean(hubURL);
const proxyConfig = loadProxyConfig();
const proxyServer = proxyConfig.httpsProxy || proxyConfig.httpProxy || '';
const proxyUsername = proxyConfig.username || '';
const proxyPassword = proxyConfig.password || '';
const runFolderName = process.env.PLAYWRIGHT_RUN_ID || getRunFolderName();
process.env.PLAYWRIGHT_RUN_ID = runFolderName;
const runFolderPath = path.join(projectConfig.outputFolder, runFolderName);
const outputDir = path.join(runFolderPath, 'artifacts');
const logFileName = projectConfig.logFileName;
const htmlReportDir = path.join(runFolderPath, 'report');
const videoOutputDir = path.resolve(projectConfig.videoFolder);

fs.mkdirSync(videoOutputDir, { recursive: true });

const resultsRoot = path.resolve(projectConfig.outputFolder);
fs.mkdirSync(resultsRoot, { recursive: true });

const logDir = path.resolve(outputDir);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logPath = path.join(logDir, logFileName);
fs.writeFileSync(logPath, `Project: ${projectConfig.projectName}\nStarted: ${new Date().toISOString()}\n`, 'utf8');

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.ts'],
  timeout: 60_000,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never', outputFolder: htmlReportDir }]],
  use: {
    baseURL,
    trace: projectConfig.traceMode as 'on' | 'off' | 'on-first-retry' | 'retain-on-failure',
    screenshot: projectConfig.screenshotMode as 'on' | 'off' | 'only-on-failure',
    video: {
      mode: projectConfig.videoMode as 'on' | 'off' | 'retain-on-failure',
      dir: videoOutputDir,
    },
    headless: true,
    testIdAttribute: 'data-testid',
    launchOptions: {
      ...(proxyServer ? { proxy: { server: proxyServer, username: proxyUsername, password: proxyPassword } } : {}),
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(runInRemoteGrid ? { connectOptions: { wsEndpoint: hubURL } } : {}),
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        ...(runInRemoteGrid ? { connectOptions: { wsEndpoint: hubURL } } : {}),
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        ...(runInRemoteGrid ? { connectOptions: { wsEndpoint: hubURL } } : {}),
      },
    },
  ],
  outputDir: outputDir,
  testIgnore: ['**/fixtures/**'],
});
