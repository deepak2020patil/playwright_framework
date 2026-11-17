const { spawnSync } = require('child_process');
const fs = require('fs');

const isCi = process.env.CI === 'true' || process.env.CI === '1';

if (isCi) {
  console.log('CI detected; skipping the local preflight check.');
  process.exit(0);
}

const preflightSetting = process.env.PREFLIGHT;
if (preflightSetting !== undefined && !['true', 'false'].includes(preflightSetting.trim().toLowerCase())) {
  console.error('PREFLIGHT must be set to "true" or "false".');
  process.exit(1);
}

if (preflightSetting && preflightSetting.trim().toLowerCase() === 'false') {
  console.log('PREFLIGHT=false; skipping the local preflight check.');
  process.exit(0);
}

const npmCli = process.env.npm_execpath;
if (!npmCli) {
  console.error('Run the preflight through npm, for example: npm test.');
  process.exit(1);
}

function run(args) {
  const result = spawnSync(process.execPath, [npmCli, ...args], { stdio: 'inherit' });
  if (result.error) {
    console.error(`Unable to run npm: ${result.error.message}`);
    process.exit(1);
  }

  return result.status === 0;
}

console.log('Checking project dependencies...');
if (!run(['ls', '--depth=0'])) {
  console.log('Dependencies are missing or out of date; installing them with npm install...');
  if (!run(['install']) || !run(['ls', '--depth=0'])) {
    console.error('Dependency installation or verification failed. Fix the errors above before running tests.');
    process.exit(1);
  }
}

const { chromium, firefox, webkit } = require('@playwright/test');
const browsers = { chromium, firefox, webkit };
const missingBrowsers = Object.entries(browsers)
  .filter(([, browser]) => !fs.existsSync(browser.executablePath()))
  .map(([name]) => name);

if (missingBrowsers.length > 0) {
  console.log(`Installing missing Playwright browsers: ${missingBrowsers.join(', ')}...`);
  if (!run(['exec', '--', 'playwright', 'install', ...missingBrowsers])) {
    console.error('Playwright browser installation failed. Fix the errors above before running tests.');
    process.exit(1);
  }

  const stillMissing = missingBrowsers.filter(
    (name) => !fs.existsSync(browsers[name].executablePath()),
  );
  if (stillMissing.length > 0) {
    console.error(`Playwright browsers are still missing: ${stillMissing.join(', ')}.`);
    process.exit(1);
  }
}

console.log('Preflight checks passed.');
