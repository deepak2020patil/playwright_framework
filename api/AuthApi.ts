import { ApiClient } from './ApiClient';

export class AuthApi {
  constructor(private apiClient: ApiClient) {}

  async login() {
    return this.apiClient.get('https://automationexercise.com/api/productsList');
  }
}
