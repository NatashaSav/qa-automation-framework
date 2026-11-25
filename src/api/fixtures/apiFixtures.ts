import { test as base, type APIRequestContext } from '@playwright/test';
import { BookingApiClient } from '../clients/bookingApiClient';
import type { ApiCredentials } from '../types/booking';

type ApiFixtures = {
    apiCredentials: ApiCredentials;
    bookingApi: BookingApiClient;
};

export const test = base.extend<ApiFixtures>({
    apiCredentials: async ({}, use) => {
        const username = process.env.API_USERNAME;
        const password = process.env.API_PASSWORD;

        if (!username || !password) {
            throw new Error('API_USERNAME and API_PASSWORD must be set to run API tests.');
        }

        await use({ username, password });
    },
    bookingApi: async ({ request }: { request: APIRequestContext }, use) => {
        await use(new BookingApiClient(request));
    },
});

export { expect } from '@playwright/test';
