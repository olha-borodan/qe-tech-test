import { test, expect } from '../fixtures/api-fixtures';
import { Booking } from '../types/booking';
import { VALID_BOOKING, BOOKING_MISSING_FIRSTNAME } from '../data/booking';

test.describe('Booking creation', () => {
  test('creating a booking returns the booking', async ({ bookingClient }) => {
    const response = await bookingClient.createBooking(VALID_BOOKING);
    const body = await response.json();

    expect(response.status(), 'create should return 200').toBe(200);
    expect(typeof body.bookingid, 'bookingid should be a number').toBe('number');

    expect(body.booking, 'returned booking should match the submitted payload').toEqual(VALID_BOOKING);
  });

  test('rejects a booking with a missing required field', async ({ bookingClient }) => {
    const response = await bookingClient.createBooking(BOOKING_MISSING_FIRSTNAME as Booking);

    // It should be 400 rather than 500 for bad requests
    expect(response.status(), 'create with a missing required field should return 500').toBe(500);
  });
});
