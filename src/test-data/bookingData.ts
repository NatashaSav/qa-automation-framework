import { randomUUID } from 'node:crypto';
import type { Booking } from '../api/types/booking';

export function createBookingData(): Booking {
    return {
        firstname: 'API',
        lastname: `Automation-${randomUUID()}`,
        totalprice: 120,
        depositpaid: true,
        bookingdates: {
            checkin: '2030-01-10',
            checkout: '2030-01-12',
        },
        additionalneeds: 'Breakfast',
    };
}
