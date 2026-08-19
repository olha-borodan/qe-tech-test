import { test, expect } from '../fixtures/api-fixtures';
import { BookingClient, Booking } from '../clients/booking-client';
import { VALID_BOOKING, BOOKING_MISSING_FIRSTNAME  } from '../data/booking-data';

test.describe('Booking creation', () => {
  let client: BookingClient;

  test.beforeEach(({ request }) => {
    client = new BookingClient(request);
  });

  test('creating a booking returns the booking', async () => {
    const response = await client.createBooking(VALID_BOOKING);
    const body = await response.json();

    expect(response.status(), 'create should return 200').toBe(200);
    expect(typeof body.bookingid, 'bookingid should be a number').toBe('number');

    expect(body.booking, 'returned booking should match the submitted payload').toEqual(VALID_BOOKING);
  });

  test('rejects a booking with a missing required field', async () => {
    const response = await client.createBooking(BOOKING_MISSING_FIRSTNAME as Booking);

    // It should be 400 rather than 500 for bad requests
    expect(response.status(), 'create with a missing required field should return 500').toBe(500);
  });
});

test.describe('Booking retrieval', () => {
  let client: BookingClient;

  test.beforeEach(({ request }) => {
    client = new BookingClient(request);
  });

  test('created booking can be retrieved by id', async () => {
    const createResponse = await client.createBooking(VALID_BOOKING);
    const { bookingid } = await createResponse.json();

    const getResponse = await client.getBooking(bookingid);
    const body = await getResponse.json();

    expect(getResponse.status(), 'get by id should return 200').toBe(200);
    expect(body, 'retrieved booking should match what was created').toEqual(VALID_BOOKING);
  });

  test('booking ids can be listed', async () => {
    const response = await client.getBookingIds();

    expect(response.status(), 'get should return 200').toBe(200);
    const body = await response.json();
    expect(Array.isArray(body), 'response body should be an array').toBe(true);
  });

  test('returns 404 for a nonexistent booking id', async () => {
    const response = await client.getBooking(-1);

    expect(response.status(), 'get with a nonexistent id should return 404').toBe(404);
  });
});
