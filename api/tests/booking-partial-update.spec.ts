import { test, expect } from '../fixtures/api-fixtures';
import { VALID_BOOKING } from '../data/booking';
import { TEST_CREDENTIALS } from '../data/credentials';

test.describe('Booking partial update', () => {
  let token: string;
  let bookingid: number;

  test.beforeEach(async ({ authClient, bookingClient }) => {
    const authResponse = await authClient.authenticate(TEST_CREDENTIALS);
    ({ token } = await authResponse.json());

    const createResponse = await bookingClient.createBooking(VALID_BOOKING);
    ({ bookingid } = await createResponse.json());
  });

  test('patching a single field updates only that field', async ({ bookingClient }) => {
    const response = await bookingClient.partialUpdateBooking(bookingid, { totalprice: 222 }, token);

    expect(response.status(), 'partial update should return 200').toBe(200);
    expect(await response.json(), 'response should reflect the patched field and leave the rest unchanged').toEqual({
      ...VALID_BOOKING,
      totalprice: 222,
    });
  });

  test('patching multiple fields updates all of them and leaves the rest unchanged', async ({ bookingClient }) => {
    const patch = { firstname: 'James', lastname: 'Brown' };

    const response = await bookingClient.partialUpdateBooking(bookingid, patch, token);

    expect(response.status(), 'partial update should return 200').toBe(200);
    expect(await response.json(), 'response should reflect the patched fields and leave the rest unchanged').toEqual({
      ...VALID_BOOKING,
      ...patch,
    });
  });

  test('patching with an empty payload leaves the booking unchanged', async ({ bookingClient }) => {
    const response = await bookingClient.partialUpdateBooking(bookingid, {}, token);

    expect(response.status(), 'partial update with an empty payload should return 200').toBe(200);
    expect(await response.json(), 'booking should be returned unmodified').toEqual(VALID_BOOKING);
  });

  test('changes made by a partial update are persisted and retrievable', async ({ bookingClient }) => {
    await bookingClient.partialUpdateBooking(bookingid, { additionalneeds: 'Dinner' }, token);

    const getResponse = await bookingClient.getBooking(bookingid);

    expect(getResponse.status(), 'get by id should return 200').toBe(200);
    expect(await getResponse.json(), 'subsequent get should reflect the patched field').toEqual({
      ...VALID_BOOKING,
      additionalneeds: 'Dinner',
    });
  });

  test('rejects a partial update without a valid token', async ({ bookingClient }) => {
    const response = await bookingClient.partialUpdateBooking(bookingid, { firstname: 'James' }, 'invalid-token');

    // Expected: 401 Unauthorized. Actual: 403 Forbidden.
    expect(response.status(), 'partial update without a valid token returns 403 (401 expected)').toBe(403);
  });

  test('returns 405 when patching a nonexistent booking id', async ({ bookingClient }) => {
    const response = await bookingClient.partialUpdateBooking(-1, { firstname: 'James' }, token);

    // Expected: 404 Not Found. Actual: 405 Method Not Allowed.
    expect(response.status(), 'partial update of a nonexistent id returns 405 (404 expected)').toBe(405);
  });
});
