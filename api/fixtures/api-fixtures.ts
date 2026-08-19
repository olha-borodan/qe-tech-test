import { test as base, expect } from '@playwright/test';
import { AuthClient } from '../clients/auth-client';
import { BookingClient } from '../clients/booking-client';

type Fixtures = {
  authClient: AuthClient;
  bookingClient: BookingClient;
};

export const test = base.extend<Fixtures>({
  authClient: async ({ request }, use) => {
    await use(new AuthClient(request));
  },

  bookingClient: async ({ request }, use) => {
    await use(new BookingClient(request));
  },
});

export { expect };