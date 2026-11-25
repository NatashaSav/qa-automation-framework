import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { ApiCredentials, Booking } from '../types/booking';

export class BookingApiClient {
    constructor(private readonly request: APIRequestContext) {}

    authenticate(credentials: ApiCredentials): Promise<APIResponse> {
        return this.request.post('/auth', {
            data: credentials,
            headers: { Accept: 'application/json' },
        });
    }

    createBooking(booking: Booking): Promise<APIResponse> {
        return this.request.post('/booking', {
            data: booking,
            headers: { Accept: 'application/json' },
        });
    }

    getBooking(bookingId: number): Promise<APIResponse> {
        return this.request.get(`/booking/${bookingId}`, {
            headers: { Accept: 'application/json' },
        });
    }

    updateBooking(bookingId: number, booking: Booking, token?: string): Promise<APIResponse> {
        return this.request.put(`/booking/${bookingId}`, {
            data: booking,
            headers: this.getHeaders(token),
        });
    }

    deleteBooking(bookingId: number, token?: string): Promise<APIResponse> {
        return this.request.delete(`/booking/${bookingId}`, {
            headers: this.getHeaders(token),
        });
    }

    private getHeaders(token?: string): Record<string, string> {
        return token
            ? { Accept: 'application/json', Cookie: `token=${token}` }
            : { Accept: 'application/json' };
    }
}
