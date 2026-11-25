import type { TestInfo } from '@playwright/test';
import { expect, test } from '../../src/api/fixtures/apiFixtures';
import type { Booking, ApiCredentials } from '../../src/api/types/booking';
import {
    getBookingId,
    isAuthResponse,
    isBooking,
    isCreateBookingResponse,
} from '../../src/api/types/booking';
import { createBookingData } from '../../src/test-data/bookingData';
import { BookingApiClient } from '../../src/api/clients/bookingApiClient';

type OwnedBooking = {
    id: number;
    token: string;
    booking: Booking;
    markAsDeleted: () => void;
};

type BookingTestAction = (booking: OwnedBooking) => Promise<void>;

async function withOwnedBooking(
    bookingApi: BookingApiClient,
    credentials: ApiCredentials,
    testInfo: TestInfo,
    action: BookingTestAction,
): Promise<void> {
    let token: string | undefined;
    let bookingId: number | undefined;
    let bookingDeleted = false;
    let testFailed = false;
    const booking = createBookingData();

    try {
        await test.step('Authenticate and obtain a token', async () => {
            const response = await bookingApi.authenticate(credentials);
            expect(response.status()).toBe(200);

            const body: unknown = await response.json();
            if (!isAuthResponse(body)) {
                throw new Error('Authentication response did not contain a non-empty token.');
            }

            token = body.token;
        });

        await test.step('Create an isolated booking', async () => {
            const response = await bookingApi.createBooking(booking);
            const body: unknown = await response.json();
            bookingId = getBookingId(body);

            expect(response.status()).toBe(200);

            if (!isCreateBookingResponse(body)) {
                throw new Error('Booking creation response did not contain a valid booking and ID.');
            }

            expect(body.booking).toEqual(booking);
        });

        if (token === undefined || bookingId === undefined) {
            throw new Error('Could not establish an authenticated booking for this test.');
        }

        await action({
            id: bookingId,
            token,
            booking,
            markAsDeleted: () => {
                bookingDeleted = true;
            },
        });
    } catch (error) {
        testFailed = true;
        throw error;
    } finally {
        if (token !== undefined && bookingId !== undefined && !bookingDeleted) {
            let cleanupFailure: string | undefined;

            try {
                const response = await bookingApi.deleteBooking(bookingId, token);
                const status = response.status();

                if (status !== 201 && status !== 404) {
                    cleanupFailure = `DELETE /booking/${bookingId} returned HTTP ${status}.`;
                }
            } catch {
                cleanupFailure = `DELETE /booking/${bookingId} failed before a response was received.`;
            }

            if (cleanupFailure !== undefined) {
                const annotation = `Booking cleanup failed: ${cleanupFailure}`;
                if (testFailed) {
                    testInfo.annotations.push({ type: 'cleanup-failure', description: annotation });
                    console.error(annotation);
                } else {
                    throw new Error(annotation);
                }
            }
        }
    }
}

test('booking can be created, updated, deleted, and fetched as not found', async ({
    bookingApi,
    apiCredentials,
}, testInfo) => {
    await withOwnedBooking(bookingApi, apiCredentials, testInfo, async ({ id, token, booking, markAsDeleted }) => {
        const updatedBooking: Booking = {
            ...booking,
            firstname: `${booking.firstname}-Updated`,
            totalprice: booking.totalprice + 25,
        };

        await test.step('Update the created booking', async () => {
            const response = await bookingApi.updateBooking(id, updatedBooking, token);
            expect(response.status()).toBe(200);

            const body: unknown = await response.json();
            if (!isBooking(body)) {
                throw new Error('Booking update response did not contain a valid booking.');
            }

            expect(body).toEqual(updatedBooking);
        });

        await test.step('Delete the created booking', async () => {
            const response = await bookingApi.deleteBooking(id, token);
            const status = response.status();

            if (status === 201 || status === 404) {
                markAsDeleted();
            }

            expect(status).toBe(201);
            expect(await response.text()).toBe('Created');
        });

        await test.step('Verify the deleted booking no longer exists', async () => {
            const response = await bookingApi.getBooking(id);
            expect(response.status()).toBe(404);
            expect(await response.text()).toBe('Not Found');
        });
    });
});

test('unauthenticated update is rejected without modifying the booking', async ({
    bookingApi,
    apiCredentials,
}, testInfo) => {
    await withOwnedBooking(bookingApi, apiCredentials, testInfo, async ({ id, booking }) => {
        await test.step('Reject an update without authentication', async () => {
            const attemptedBooking: Booking = { ...booking, firstname: `${booking.firstname}-Changed` };
            const response = await bookingApi.updateBooking(id, attemptedBooking);

            expect(response.status()).toBe(403);
            expect(await response.text()).toBe('Forbidden');
        });

        await test.step('Verify the booking remains unchanged', async () => {
            const response = await bookingApi.getBooking(id);
            expect(response.status()).toBe(200);

            const body: unknown = await response.json();
            if (!isBooking(body)) {
                throw new Error('Booking lookup response did not contain a valid booking.');
            }

            expect(body).toEqual(booking);
        });
    });
});

test('unauthenticated delete is rejected without deleting the booking', async ({
    bookingApi,
    apiCredentials,
}, testInfo) => {
    await withOwnedBooking(bookingApi, apiCredentials, testInfo, async ({ id, booking }) => {
        await test.step('Reject a deletion without authentication', async () => {
            const response = await bookingApi.deleteBooking(id);

            expect(response.status()).toBe(403);
            expect(await response.text()).toBe('Forbidden');
        });

        await test.step('Verify the booking remains available', async () => {
            const response = await bookingApi.getBooking(id);
            expect(response.status()).toBe(200);

            const body: unknown = await response.json();
            if (!isBooking(body)) {
                throw new Error('Booking lookup response did not contain a valid booking.');
            }

            expect(body).toEqual(booking);
        });
    });
});
