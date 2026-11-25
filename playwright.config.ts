
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    testDir: './tests',

    fullyParallel: true,

    forbidOnly: Boolean(process.env.CI),

    workers: process.env.CI ? 2 : undefined,

    reporter: [
        ['list'],
        ['html', { open: 'never' }],
    ],

    use: {
        testIdAttribute: 'data-test',
    },

    projects: [
        {
            name: 'ui-chromium',

            testMatch: '**/ui/**/*.spec.ts',

            retries: process.env.CI ? 1 : 0,

            use: {
                ...devices['Desktop Chrome'],

                baseURL: process.env.UI_BASE_URL ?? 'https://www.saucedemo.com',

                trace: 'retain-on-failure',

                screenshot: 'only-on-failure',

                video: 'retain-on-failure',
            },
        },

        {
            name: 'api',

            testMatch: '**/api/**/*.spec.ts',

            fullyParallel: false,

            retries: 0,

            workers: 1,

            use: {
                baseURL: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com',
            },
        },
    ],
});
