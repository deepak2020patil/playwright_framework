import { APIRequestContext } from '@playwright/test';

export class ApiClient {
  constructor(private request: APIRequestContext) {}

  async get(url: string) {
    return this.request.get(url);
  }
}
