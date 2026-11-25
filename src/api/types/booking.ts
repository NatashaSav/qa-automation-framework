export interface ApiCredentials {
    username: string;
    password: string;
}

export interface BookingDates {
    checkin: string;
    checkout: string;
}

export interface Booking {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: BookingDates;
    additionalneeds: string;
}

export interface AuthResponse {
    token: string;
}

export interface CreateBookingResponse {
    bookingid: number;
    booking: Booking;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

export function isAuthResponse(value: unknown): value is AuthResponse {
    return isRecord(value) && typeof value.token === 'string' && value.token.length > 0;
}

export function isBooking(value: unknown): value is Booking {
    if (!isRecord(value) || !isRecord(value.bookingdates)) {
        return false;
    }

    return (
        typeof value.firstname === 'string' &&
        typeof value.lastname === 'string' &&
        typeof value.totalprice === 'number' &&
        Number.isFinite(value.totalprice) &&
        typeof value.depositpaid === 'boolean' &&
        typeof value.bookingdates.checkin === 'string' &&
        typeof value.bookingdates.checkout === 'string' &&
        typeof value.additionalneeds === 'string'
    );
}

export function getBookingId(value: unknown): number | undefined {
    if (!isRecord(value) || typeof value.bookingid !== 'number' || !Number.isInteger(value.bookingid)) {
        return undefined;
    }

    return value.bookingid;
}

export function isCreateBookingResponse(value: unknown): value is CreateBookingResponse {
    return getBookingId(value) !== undefined && isRecord(value) && isBooking(value.booking);
}
