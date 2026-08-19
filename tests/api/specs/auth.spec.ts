import { test, expect } from '@playwright/test';
import { CREDENTIALS } from '../client/auth';

test('valid credentials return a token', async ({ request }) => {
  const response = await request.post('/auth', {
    data: CREDENTIALS ,
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.token).toBeTruthy();
});

test('invalid credentials do not return a token', async ({ request }) => {
  const response = await request.post('/auth', {
    data: { username: 'admin', password: 'wrong-password' },
  });

  // The API returns 200 and includes the reason in the response body instead of returning 401.
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.token).toBeUndefined();
  expect(body.reason).toBe('Bad credentials');
});