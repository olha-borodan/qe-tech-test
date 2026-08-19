import { test, expect } from '../fixtures/api-fixtures';
import { TEST_CREDENTIALS } from '../data/credentials';


test.describe('Auth', () => {
  test('valid credentials return a token', async ({ authClient }) => {
    const response = await authClient.authenticate(TEST_CREDENTIALS);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.token).toBeTruthy();
  });

  test('invalid credentials do not return a token', async ({ authClient }) => {
    const response = await authClient.authenticate({
      username: TEST_CREDENTIALS.username,
      password: 'wrong-password',
    });

    // The API returns 200 and includes the reason in the response body instead of returning 401.
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });
});