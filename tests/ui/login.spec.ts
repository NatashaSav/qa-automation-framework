import { expect, test } from '../../src/ui/fixtures/testFixtures';
import { InventoryPage } from '../../src/ui/pages/InventoryPage';
import { LoginPage } from '../../src/ui/pages/LoginPage';

test('standard user can log in successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.pageTitle).toBeVisible();
});

test('locked-out user is rejected and remains on the login page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');
    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).not.toHaveURL(/inventory\.html/);
});

test('standard user with an incorrect password is rejected', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'wrong_password');

    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
        'Epic sadface: Username and password do not match any user in this service',
    );
    await expect(page).toHaveURL('/');
    await expect(page).not.toHaveURL(/inventory\.html/);
});