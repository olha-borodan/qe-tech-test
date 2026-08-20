import { test, expect } from '../fixtures/api-fixtures';
import { VALID_BOOKING } from '../data/booking';
import { TEST_CREDENTIALS } from '../data/credentials';

test.describe('Booking deletion', () => {
  let token: string;
  let bookingid: number;

  test.beforeEach(async ({ authClient, bookingClient }) => {
    const authResponse = await authClient.authenticate(TEST_CREDENTIALS);
    ({ token } = await authResponse.json());

    const createResponse = await bookingClient.createBooking(VALID_BOOKING);
    ({ bookingid } = await createResponse.json());
  });

  test('deleting a booking removes it', async ({ bookingClient }) => {
    const deleteResponse = await bookingClient.deleteBooking(bookingid, token);

    expect(deleteResponse.status(), 'delete should return 201').toBe(201);

    const getResponse = await bookingClient.getBooking(bookingid);

    expect(getResponse.status(), 'deleted booking should no longer be retrievable').toBe(404);
  });

  test('rejects a delete without a valid token', async ({ bookingClient }) => {
    const response = await bookingClient.deleteBooking(bookingid, 'invalid-token');

    // Expected: 401 Unauthorized. Actual: 403 Forbidden.
    expect(response.status(), 'delete without a valid token returns 403 (401 expected)').toBe(403);
  });

  test('returns 405 when deleting a nonexistent booking id', async ({ bookingClient }) => {
    const response = await bookingClient.deleteBooking(-1, token);

    // Expected: 404 Not Found. Actual: 405 Method Not Allowed.
    expect(response.status(), 'delete of a nonexistent id returns 405 (404 expected)').toBe(405);
  });
});
