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

    // It should be 401 rather than 403 for an invalid token
    expect(response.status(), 'delete without a valid token should return 403').toBe(403);
  });

  test('returns 405 when deleting a nonexistent booking id', async ({ bookingClient }) => {
    const response = await bookingClient.deleteBooking(-1, token);

    // It should be 404 rather than 405 for a nonexistent booking id
    expect(response.status(), 'delete of a nonexistent id should return 405').toBe(405);
  });
});
