# Playwright Framework

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
- fixtures/ - Playwright fixtures for shared setup
- utils/ - common helpers such as logging, API calls, and common UI actions
- constants/ - URL and message constants
- api/ - API client wrappers
- auth/ - setup for auth/storage state
- helpers/ - additional support helpers
- test-data/ - JSON/Excel data files
- reports/ - generated HTML reports
- screenshots/ - captured screenshots
- videos/ - recorded videos
- traces/ - trace files

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
- Add proxy details in proxy-config.json
- Use .env for environment-based values such as UI and API URLs

## Artifact and Media Settings
The framework supports the following artifact options:
- screenshots: controlled through projectConfig.screenshotMode
- videos: controlled through projectConfig.videoMode
- traces: enabled on first retry by default
- HTML reports: generated under reports/html or the run-specific output folder

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
