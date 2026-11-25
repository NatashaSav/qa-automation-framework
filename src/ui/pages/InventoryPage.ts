import type { Locator, Page } from '@playwright/test';

export class InventoryPage {
    readonly pageTitle: Locator;
    readonly productItems: Locator;

    private readonly productSort: Locator;
    private readonly shoppingCartLink: Locator;

    constructor(private readonly page: Page) {
        this.pageTitle = page.getByText('Products', { exact: true });
        this.productItems = page.getByTestId('inventory-item');
        this.productSort = page.getByTestId('product-sort-container');
        this.shoppingCartLink = page.getByTestId('shopping-cart-link');
    }

    async waitUntilLoaded(): Promise<void> {
        await this.pageTitle.waitFor({ state: 'visible' });
    }

    async sortByPriceAscending(): Promise<void> {
        await this.productSort.selectOption('lohi');
    }

    async addProductToCart(productName: string): Promise<void> {
        const product = this.productItems.filter({
            has: this.page.getByText(productName, { exact: true }),
        });

        await product.getByRole('button', { name: 'Add to cart', exact: true }).click();
    }

    async openCart(): Promise<void> {
        await this.shoppingCartLink.click();
    }
}
