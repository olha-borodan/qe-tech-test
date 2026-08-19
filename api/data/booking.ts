import { Booking } from '../types/booking';

export const VALID_BOOKING: Booking = {
  firstname: 'John',
  lastname: 'Dow',
  totalprice: 111,
  depositpaid: true,
  bookingdates: {
    checkin: '2026-08-19',
    checkout: '2026-08-25',
  },
  additionalneeds: 'Breakfast',
};

export const BOOKING_MISSING_FIRSTNAME: Partial<Booking> = {
  lastname: 'Dow',
  totalprice: 111,
  depositpaid: true,
  bookingdates: {
    checkin: '2026-08-19',
    checkout: '2026-08-25',
  },
  additionalneeds: 'Breakfast',
};
