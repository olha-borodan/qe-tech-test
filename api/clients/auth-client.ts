import { APIRequestContext } from '@playwright/test';

export type Credentials = {
  username: string;
  password: string;
};

export class AuthClient {
  constructor(private readonly request: APIRequestContext) {}

  async authenticate(credentials: Credentials) {
    return this.request.post('/auth', {
      data: credentials,
    });
  }
}