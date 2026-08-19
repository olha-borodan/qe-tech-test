import { test, expect } from '../fixtures/api-fixtures';
import { Booking } from '../types/booking';
import { VALID_BOOKING, BOOKING_MISSING_FIRSTNAME } from '../data/booking';
import { TEST_CREDENTIALS } from '../data/credentials';

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
    expect(Array.isArray(body), 'response body should be an array').toBe(true);
  });

  test('returns 404 for a nonexistent booking id', async ({ bookingClient }) => {
    const response = await bookingClient.getBooking(-1);

    expect(response.status(), 'get with a nonexistent id should return 404').toBe(404);
  });
});

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
    // It should be 401 rather than 403 for an invalid token
    const response = await bookingClient.updateBooking(bookingid, VALID_BOOKING, 'invalid-token');

    expect(response.status(), 'update without a valid token should return 403').toBe(403);
  });

  test('rejects an update with a missing required field', async ({ bookingClient }) => {
    const response = await bookingClient.updateBooking(bookingid, BOOKING_MISSING_FIRSTNAME as Booking, token);

    expect(response.status(), 'update with a missing required field should return 400').toBe(400);
  });

  test('returns 405 when updating a nonexistent booking id', async ({ bookingClient }) => {
    // It should be 404 rather than 405 for a nonexistent booking id
    const response = await bookingClient.updateBooking(-1, VALID_BOOKING, token);

    expect(response.status(), 'update of a nonexistent id should return 405').toBe(405);
  });
});

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
    // It should be 401 rather than 403 for an invalid token
    const response = await bookingClient.deleteBooking(bookingid, 'invalid-token');

    expect(response.status(), 'delete without a valid token should return 403').toBe(403);
  });

  test('returns 405 when deleting a nonexistent booking id', async ({ bookingClient }) => {
    // It should be 404 rather than 405 for a nonexistent booking id
    const response = await bookingClient.deleteBooking(-1, token);

    expect(response.status(), 'delete of a nonexistent id should return 405').toBe(405);
  });
});
