import { APIRequestContext } from '@playwright/test';

// Restful Booker's documented public demo credentials — not secrets.
export const CREDENTIALS = { username: 'admin', password: 'password123' };

export async function getAuthToken(request: APIRequestContext) {
  const response = await request.post('/auth', { data: CREDENTIALS });
  const body = await response.json();
  return body.token;
}