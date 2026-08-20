import { test, expect } from '../fixtures/api-fixtures';

test('health check returns 201', async ({ request }) => {
  const response = await request.get('/ping');

  expect(response.status()).toBe(201);
});