import { test, expect } from '../fixtures/api-fixtures';
import { Booking } from '../clients/booking-client';
import { VALID_BOOKING, BOOKING_MISSING_FIRSTNAME } from '../data/booking-data';
import { TEST_CREDENTIALS } from '../data/credentials';

test.describe('Booking update', () => {
  let token: string;
  let bookingid: number;

  test.beforeEach(async ({ authClient, bookingClient }) => {
    const authResponse = await authClient.authenticate(TEST_CREDENTIALS);
    ({ token } = await authResponse.json());

    const createResponse = await bookingClient.createBooking(VALID_BOOKING);
    ({ bookingid } = await createResponse.json());
  });

  test('updating a booking returns the updated booking', async ({ bookingClient }) => {
    const updatedBooking = { ...VALID_BOOKING, firstname: 'James' };

    const response = await bookingClient.updateBooking(bookingid, updatedBooking, token);

    expect(response.status(), 'update should return 200').toBe(200);
    expect(await response.json(), 'response should reflect the updated fields').toEqual(updatedBooking);
  });

  test('rejects an update without a valid token', async ({ bookingClient }) => {
    const response = await bookingClient.updateBooking(bookingid, VALID_BOOKING, 'invalid-token');

    // It should be 401 rather than 403 for an invalid token
    expect(response.status(), 'update without a valid token should return 403').toBe(403);
  });

  test('rejects an update with a missing required field', async ({ bookingClient }) => {
    const response = await bookingClient.updateBooking(bookingid, BOOKING_MISSING_FIRSTNAME as Booking, token);

    expect(response.status(), 'update with a missing required field should return 400').toBe(400);
  });

  test('returns 405 when updating a nonexistent booking id', async ({ bookingClient }) => {
    const response = await bookingClient.updateBooking(-1, VALID_BOOKING, token);

    // It should be 404 rather than 405 for a nonexistent booking id
    expect(response.status(), 'update of a nonexistent id should return 405').toBe(405);
  });
});
