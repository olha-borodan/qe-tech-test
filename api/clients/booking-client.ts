import { APIRequestContext } from '@playwright/test';
import { Booking } from '../types/booking';

export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  async getBookingIds() {
    return this.request.get('/booking');
  }

  async getBooking(id: number) {
    return this.request.get(`/booking/${id}`);
  }

  async createBooking(booking: Booking) {
    return this.request.post('/booking', { data: booking });
  }

  async updateBooking(id: number, booking: Booking, token: string) {
    return this.request.put(`/booking/${id}`, {
      data: booking,
      headers: { Cookie: `token=${token}` },
    });
  }

  async partialUpdateBooking(id: number, fields: Partial<Booking>, token: string) {
    return this.request.patch(`/booking/${id}`, {
      data: fields,
      headers: { Cookie: `token=${token}` },
    });
  }

  async deleteBooking(id: number, token: string) {
    return this.request.delete(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
    });
  }
}