> Framework created by Deepak Patil <deepakpatil.slk@gmail.com>\n# Playwright Framework

A scalable Playwright + TypeScript automation framework with a page-object-style structure, reusable utilities, API helpers, proxy support, logging, fixtures, and configurable artifacts.

## Tech Stack
- Playwright Test
- TypeScript
- Node.js
- xlsx for Excel-based test data
- JSON-based test data support
- Proxy support via proxy-config.json
- HTML reporting and test artifacts

## Project Structure
- tests/ - test suites grouped by feature
  - examples/ - sample smoke and utility tests
  - login/ - login-related examples
  - dashboard/ - dashboard-related examples
  - api/ - API smoke examples
- pages/ - page object classes
- components/ - reusable UI component helpers
- fixtures/ - Playwright fixtures for shared setup and report utilities
- utils/ - common helpers such as logging, API calls, screenshots, videos, traces
- constants/ - URL and message constants
- api/ - API client wrappers
- auth/ - setup for auth/storage state
- config/ - configuration files (proxy-config.json, etc.)
- test-data/ - JSON/Excel data files
- test-results/ - consolidated test artifacts per run
  - test_XXXX/ - individual run folder containing:
    - artifacts/ - screenshots, logs, traces, videos
    - report/ - HTML test report with attachments
- videos/ - fallback for step videos (optional, on-demand)
- screenshots/ - fallback for step screenshots (optional, on-demand)
- storage/ - browser auth state

## Core Features
- Page Object Model (POM) structure
- Reusable UI helpers
- Reusable API helpers
- Logger and test logger support
- Fixture-based setup
- Data-driven test support using JSON and Excel
- Proxy-aware browser launch from proxy-config.json
- Configurable screenshot and video behavior
- Consolidated output folders per run

## Logging
- Logger writes informational and debug messages to the console
- TestLogger writes run logs to the run-specific artifacts folder
- Logs are created under the current run folder in test-results/

## Fixtures
- baseFixture.ts provides a reusable homePage fixture
- authFixture.ts can be extended for authentication-based scenarios

## Helpers
- commonMethods.ts contains reusable UI operations such as click, type, getText, getAttribute, and window switching
- apiMethods.ts contains reusable API operations such as GET, POST, PUT, DELETE, and status validation
- ExcelUtil.ts and JsonUtil.ts support external data loading
- ScreenshotUtil.ts captures screenshots for debugging

## Configuration
- Configure browser/test behavior in playwright.config.ts
- Configure project settings in tests/config/projectConfig.ts
- Add proxy details in config/proxy-config.json
- Use .env for environment-based values such as UI and API URLs

## Artifact and Media Settings
All artifacts are consolidated per test run in `test-results/test_XXXX/artifacts/`:
- **screenshots**: Captured on failure (configurable via projectConfig.screenshotMode)
  - **Step-level screenshots**: Enable with `ENABLE_STEP_SCREENSHOTS=true` in .env or code
  - Use `ScreenshotUtil.capture(page, 'filename.png')` in tests to capture at each step
  - Can force capture with `ScreenshotUtil.capture(page, 'filename.png', true)` regardless of config
  - Can attach to HTML report with `ReportUtil.attachScreenshot(testInfo, path, label)`
- **videos**: Recorded on failure by default (configurable via projectConfig.videoMode)
  - **Step-level videos**: Enable with `ENABLE_STEP_VIDEOS=true` in .env or code
  - Use `VideoUtil.startStepRecording(context, 'step-name')` in tests to record at specific steps
  - Stored in videos folder with step name in filename
  - Use `VideoUtil.getStepVideos()` to list recorded step videos
  - Use `VideoUtil.cleanupOldStepVideos(24)` to clean up old recordings
  - Can attach to HTML report with `ReportUtil.attachVideo(testInfo, path, label)`
- **traces**: Recorded on first retry by default (configurable via TRACE_MODE in .env)
  - Stored in `test-results/test_XXXX/artifacts/` as .zip files
  - View trace with: `npx playwright show-trace <trace-file>`
  - Enable trace attachments in reports with `ENABLE_TRACE_ATTACHMENTS=true`
  - Can attach to HTML report with `ReportUtil.attachTrace(testInfo, path, label)`
  - Use `TraceUtil.cleanupOldTraces(directory, 24)` to clean up old traces
- **HTML reports**: Generated in `test-results/test_XXXX/report/` with embedded attachments
- **logs**: Written to `test-results/test_XXXX/artifacts/execution.log`

## Step-Level Screenshots
Enable screenshot capture at each test step for better debugging:

**Option 1: Via Environment Variable**
```bash
set ENABLE_STEP_SCREENSHOTS=true
npx playwright test
```

**Option 2: In .env file**
```env
ENABLE_STEP_SCREENSHOTS=true
```

**Option 3: In Test Code**
```typescript
import { ScreenshotUtil } from '../../utils/ScreenshotUtil';

// Capture only if step screenshots are enabled in config
await ScreenshotUtil.capture(page, '01-step-name.png');

// Force capture regardless of config setting
await ScreenshotUtil.capture(page, '02-force-capture.png', true);

// Check if step screenshots are enabled
if (ScreenshotUtil.isStepScreenshotsEnabled()) {
  // Do something conditionally
}
```

See [tests/examples/step-screenshot-example.spec.ts](tests/examples/step-screenshot-example.spec.ts) for a complete example.

## Step-Level Videos
Enable video recording at each test step for better debugging:

**Option 1: Via Environment Variable**
```bash
set ENABLE_STEP_VIDEOS=true
npx playwright test
```

**Option 2: In .env file**
```env
ENABLE_STEP_VIDEOS=true
```

**Option 3: In Test Code**
```typescript
import { VideoUtil } from '../../utils/VideoUtil';

// Check if step videos are enabled
if (VideoUtil.isStepVideosEnabled()) {
  // Start recording at specific step
  const videoPath = VideoUtil.startStepRecording(context, 'step-name');
}

// Get list of recorded step videos
const stepVideos = VideoUtil.getStepVideos();

// Clean up old step videos (older than 24 hours)
const deletedCount = VideoUtil.cleanupOldStepVideos(24);

// Get configured video folder
const videoFolder = VideoUtil.getVideoFolder();
```

See [tests/examples/step-video-example.spec.ts](tests/examples/step-video-example.spec.ts) for a complete example.

## Trace Configuration
Enable and manage Playwright trace recording for debugging test execution:

**Option 1: Via Environment Variable**
```bash
set TRACE_MODE=on-first-retry
npx playwright test
```

**Option 2: In .env file**
```env
TRACE_MODE=on-first-retry
ENABLE_TRACE_ATTACHMENTS=true
```

**Trace Modes:**
- `on` - Record trace for all tests (generates large files)
- `off` - No trace recording
- `on-first-retry` - Record traces only on first retry (default, balances performance and debugging)
- `retain-on-failure` - Only save traces when tests fail

**Usage in Tests:**
```typescript
import { TraceUtil } from '../../utils/TraceUtil';

// Check if traces are enabled
if (TraceUtil.isTraceEnabled()) {
  const mode = TraceUtil.getTraceMode();
  logger.write(`Trace mode: ${mode}`);
}

// Attach trace to report
if (TraceUtil.isTraceAttachmentEnabled()) {
  await ReportUtil.attachTrace(testInfo, '/path/to/trace.zip', 'trace-label');
}

// Clean up old traces (older than 24 hours)
const deleted = TraceUtil.cleanupOldTraces('traces/', 24);
```

**View Traces:**
```bash
# Traces are stored in: test-results/test_XXXX/artifacts/
# View trace interactively:
npx playwright show-trace <path-to-trace-file.zip>
```

## Enhanced HTML Reports with Attachments
Screenshots, videos, and traces can be automatically attached to the HTML test report for each test step:

**Features:**
- Attach step-level screenshots to each test case
- Attach step-level videos to each test case
- Attach trace files for full test session debugging
- All attachments appear in the interactive HTML report under each test
- Click attachment thumbnails to view full resolution or download

**Usage in Tests:**
```typescript
import { test, expect, ReportUtil } from '../../fixtures/reportFixture';

test('my test with report attachments', async ({ page, testInfo }) => {
  // Perform action and capture/attach screenshot
  await ReportUtil.captureAndAttachScreenshot(testInfo, page, 'step-01-action-name');

  // Attach existing screenshot file
  await ReportUtil.attachScreenshot(testInfo, 'path/to/screenshot.png', 'custom-label');

  // Attach all screenshots from directory
  await ReportUtil.attachScreenshots(testInfo, 'screenshots/', 'step_');

  // Attach video file
  await ReportUtil.attachVideo(testInfo, 'path/to/video.webm', 'test-video');

  // Attach all step videos from directory
  await ReportUtil.attachVideos(testInfo, 'videos/', 'step_');

  // Attach trace file
  await ReportUtil.attachTrace(testInfo, 'path/to/trace.zip', 'trace-label');

  // Attach all traces from directory
  await ReportUtil.attachTraces(testInfo, 'traces/');
});
```

**ReportUtil Methods:**
```typescript
// Attach single screenshot
ReportUtil.attachScreenshot(testInfo, filePath, label)

// Attach multiple screenshots from directory
ReportUtil.attachScreenshots(testInfo, directory, prefix)

// Attach single video
ReportUtil.attachVideo(testInfo, filePath, label)

// Attach multiple videos from directory
ReportUtil.attachVideos(testInfo, directory, prefix)

// Capture screenshot and automatically attach
ReportUtil.captureAndAttachScreenshot(testInfo, page, label, screenshotDir)

// Attach single trace file (.zip)
ReportUtil.attachTrace(testInfo, filePath, label)

// Attach all trace files from directory
ReportUtil.attachTraces(testInfo, directory)
```

**View Report:**
```bash
# Open the HTML report after tests complete
npx playwright show-report test-results/test_XXXX/report

# View trace file directly
npx playwright show-trace test-results/test_XXXX/artifacts/trace.zip
```

See [tests/examples/enhanced-report-example.spec.ts](tests/examples/enhanced-report-example.spec.ts) and [tests/examples/trace-example.spec.ts](tests/examples/trace-example.spec.ts) for complete examples.

## Run Tests
```bash
npx playwright test
```

## Run a specific suite
```bash
npx playwright test --project=chromium tests/examples
```

## Example Proxy Configuration
Update proxy-config.json with your proxy details:
```json
{
  "httpProxy": "http://proxy-host:port",
  "httpsProxy": "http://proxy-host:port",
  "username": "your-username",
  "password": "your-password"
}
```

