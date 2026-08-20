import { test, expect } from '../fixtures/api-fixtures';
import { VALID_BOOKING } from '../data/booking';

test.describe('Booking retrieval', () => {
  test('created booking can be retrieved by id', async ({ bookingClient }) => {
    const createResponse = await bookingClient.createBooking(VALID_BOOKING);
    const { bookingid } = await createResponse.json();

    const getResponse = await bookingClient.getBooking(bookingid);
    const body = await getResponse.json();

    expect(getResponse.status(), 'get by id should return 200').toBe(200);
    expect(body, 'retrieved booking should match what was created').toEqual(VALID_BOOKING);
  });

  test('booking ids can be listed', async ({ bookingClient }) => {
    const response = await bookingClient.getBookingIds();

    expect(response.status(), 'get should return 200').toBe(200);
    const body = await response.json();
    expect(body.length, 'response body should not be empty').toBeGreaterThan(0);
    body.forEach((item: unknown) =>
      expect(item, 'each entry should be a booking id object').toEqual({ bookingid: expect.any(Number) }),
    );
  });

  test('returns 404 for a nonexistent booking id', async ({ bookingClient }) => {
    const response = await bookingClient.getBooking(-1);

    expect(response.status(), 'get with a nonexistent id should return 404').toBe(404);
  });
});
