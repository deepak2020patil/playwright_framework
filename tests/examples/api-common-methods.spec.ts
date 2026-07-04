/** Framework created by Deepak Patil <deepakpatil.slk@gmail.com> */import { test, expect } from '@playwright/test';
import { projectConfig } from '../config/projectConfig';
import { ApiMethods } from '../../utils/apiMethods';
import { Logger } from '../../utils/logger';
import { TestLogger } from '../../utils/testLogger';

test('API common methods and logger work', async ({ request }) => {
  const logger = new Logger();
  const testLogger = new TestLogger();
  const api = new ApiMethods(request);

  testLogger.write('Starting API common methods test');
  logger.info('Calling API endpoint');
  const response = await api.get(projectConfig.apiBaseUrl);

  await api.assertStatus(response, 200);
  const body = await response.json();

  testLogger.write(`Response code: ${body.responseCode}`);
  logger.debug(`Response code: ${body.responseCode}`);
  expect(body).toHaveProperty('products');
  expect(body).toHaveProperty('responseCode', 200);
});

