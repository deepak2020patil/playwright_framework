const fs = require('fs');
const path = require('path');

const resultsRoot = path.resolve(__dirname, '..', 'test-results');

if (!fs.existsSync(resultsRoot)) {
  process.exit(0);
}

const runFolders = fs
  .readdirSync(resultsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.startsWith('test_'))
  .map((entry) => ({
    name: entry.name,
    fullPath: path.join(resultsRoot, entry.name),
    mtimeMs: fs.statSync(path.join(resultsRoot, entry.name)).mtimeMs,
  }))
  .sort((a, b) => b.mtimeMs - a.mtimeMs);

const latestRun = runFolders[0];

if (!latestRun) {
  process.exit(0);
}

function removeDir(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return;
  }

  if (fs.lstatSync(targetPath).isDirectory()) {
    for (const child of fs.readdirSync(targetPath)) {
      removeDir(path.join(targetPath, child));
    }
    fs.rmdirSync(targetPath);
  } else {
    fs.unlinkSync(targetPath);
  }
}

for (const olderRun of runFolders.slice(1)) {
  removeDir(olderRun.fullPath);
}

console.log(`Preserved consolidated run: ${latestRun.name}`);
