/** Framework created by Deepak Patil <deepakpatil.slk@gmail.com> */import { APIRequestContext, APIResponse } from '@playwright/test';
import { Logger } from './logger';

export class ApiMethods {
  private logger: Logger;

  constructor(private request: APIRequestContext, logger?: Logger) {
    this.logger = logger ?? new Logger();
  }

  async get(url: string, options?: Record<string, unknown>) {
    this.logger.info(`GET ${url}`);
    return await this.request.get(url, options);
  }

  async post(url: string, options?: Record<string, unknown>) {
    this.logger.info(`POST ${url}`);
    return await this.request.post(url, options);
  }

  async put(url: string, options?: Record<string, unknown>) {
    this.logger.info(`PUT ${url}`);
    return await this.request.put(url, options);
  }

  async delete(url: string, options?: Record<string, unknown>) {
    this.logger.info(`DELETE ${url}`);
    return await this.request.delete(url, options);
  }

  async getJson<T = unknown>(url: string, options?: Record<string, unknown>): Promise<T> {
    this.logger.info(`Fetching JSON from ${url}`);
    const response = await this.get(url, options);
    return (await response.json()) as T;
  }

  async assertStatus(response: APIResponse, expectedStatus: number) {
    this.logger.info(`Validating response status: expected ${expectedStatus}, actual ${response.status()}`);
    if (response.status() !== expectedStatus) {
      throw new Error(`Expected status ${expectedStatus} but got ${response.status()}`);
    }
  }
}

