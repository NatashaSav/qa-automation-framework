import { test as base, type Page } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';

type UiFixtures = {
    authenticatedPage: Page;
};

export const test = base.extend<UiFixtures>({
    authenticatedPage: async ({ page }, use) => {
        const username = process.env.UI_USERNAME;
        const password = process.env.UI_PASSWORD;

        if (!username || !password) {
            throw new Error('UI_USERNAME and UI_PASSWORD must be set to use authenticatedPage.');
        }

        const loginPage = new LoginPage(page);
        await loginPage.open();
        await loginPage.login(username, password);

        const inventoryPage = new InventoryPage(page);
        await inventoryPage.waitUntilLoaded();

        await use(page);
    },
});

export { expect } from '@playwright/test';
