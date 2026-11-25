import type { Locator, Page } from '@playwright/test';

export class CartPage {
    readonly cartItems: Locator;

    private readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.cartItems = page.getByTestId('inventory-item');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout', exact: true });
    }

    async proceedToCheckout(): Promise<void> {
        await this.checkoutButton.click();
    }
}
