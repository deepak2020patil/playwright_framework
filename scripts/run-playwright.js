const { spawn } = require('child_process');

const hubUrl = process.env.HUB_URL || 'http://localhost:4444/playwright/playwright.js';
const args = ['test'];

if (process.argv.length > 2) {
  args.push(...process.argv.slice(2));
}

const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['playwright', ...args], {
  stdio: 'inherit',
  env: { ...process.env, HUB_URL: hubUrl },
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
