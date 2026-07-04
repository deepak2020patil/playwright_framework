import { ApiClient } from './ApiClient';

export class UserApi {
  constructor(private apiClient: ApiClient) {}

  async getUsers() {
    return this.apiClient.get('https://automationexercise.com/api/productsList');
  }
}
