import type { Locator, Page } from '@playwright/test';

export class CheckoutPage {
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly errorMessage: Locator;
    readonly confirmationMessage: Locator;

    private readonly continueButton: Locator;
    private readonly finishButton: Locator;

    constructor(page: Page) {
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
        this.errorMessage = page.getByTestId('error');
        this.confirmationMessage = page.getByTestId('complete-header');
        this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
        this.finishButton = page.getByRole('button', { name: 'Finish', exact: true });
    }

    async fillCustomerInformation(
        firstName: string,
        lastName: string,
        postalCode: string,
    ): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    async continueToOverview(): Promise<void> {
        await this.continueButton.click();
    }

    async finishOrder(): Promise<void> {
        await this.finishButton.click();
    }
}
