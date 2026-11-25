import { expect, test } from '../../src/ui/fixtures/testFixtures';
import { CartPage } from '../../src/ui/pages/CartPage';
import { CheckoutPage } from '../../src/ui/pages/CheckoutPage';
import { InventoryPage } from '../../src/ui/pages/InventoryPage';

test('authenticated user can view the product catalog', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);

    await expect(inventoryPage.pageTitle).toBeVisible();
    await expect(inventoryPage.productItems.first()).toBeVisible();

    const productCount = await inventoryPage.productItems.count();
    expect(productCount).toBeGreaterThan(0);

    for (let index = 0; index < productCount; index += 1) {
        const product = inventoryPage.productItems.nth(index);

        await expect(product.getByTestId('inventory-item-name')).toHaveText(/\S/);
        await expect(product.getByTestId('inventory-item-price')).toHaveText(/^\$\d+\.\d{2}$/);
    }
});

test('products can be sorted by price from low to high', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);

    await inventoryPage.sortByPriceAscending();

    const priceTexts = await inventoryPage.productItems
        .getByTestId('inventory-item-price')
        .allTextContents();

    expect(priceTexts.length).toBeGreaterThan(0);
    expect(priceTexts.every((priceText) => /^\$\d+\.\d{2}$/.test(priceText))).toBe(true);

    const prices = priceTexts.map((priceText) => Number(priceText.replace(/^\$/, '')));
    expect(prices.every(Number.isFinite)).toBe(true);
    expect(prices).toEqual([...prices].sort((firstPrice, secondPrice) => firstPrice - secondPrice));
});

test('selected product appears in the cart', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);
    const productName = 'Sauce Labs Backpack';

    await inventoryPage.addProductToCart(productName);
    await inventoryPage.openCart();

    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.cartItems.getByText(productName, { exact: true })).toBeVisible();
});

test('user can complete checkout', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);
    const checkoutPage = new CheckoutPage(authenticatedPage);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCustomerInformation('Alex', 'Morgan', '10001');
    await checkoutPage.continueToOverview();
    await checkoutPage.finishOrder();

    await expect(checkoutPage.confirmationMessage).toHaveText('Thank you for your order!');
});

test('checkout requires customer details', async ({ authenticatedPage }) => {
    const inventoryPage = new InventoryPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);
    const checkoutPage = new CheckoutPage(authenticatedPage);

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.continueToOverview();

    await expect(authenticatedPage.getByText('Checkout: Your Information', {
        exact: true,
    })).toBeVisible();
    await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');
});
