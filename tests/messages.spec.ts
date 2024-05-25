import { test, expect } from '@playwright/test';

test.describe('Customer and Admin Operations', () => {

    test('Verify message flow between admin and customer', async ({ browser }) => {
        let msgSubject = 'Return';
        // Create a new browser context for the customer with saved authentication state
        const customerContext = await browser.newContext({ storageState: 'customerAuth.json' });
        const customerPage = await customerContext.newPage();

        // Customer operation
        await customerPage.goto('https://practicesoftwaretesting.com/#/');
        await customerPage.locator('[data-test="nav-contact"]').click();
        await customerPage.locator('[data-test="subject"]').selectOption(msgSubject);
        await customerPage.locator('[data-test="message"]').fill('Hi This is a test message to get customer service.');
        await customerPage.locator('[data-test="contact-submit"]').click();

        // Create a new browser context for the admin with saved authentication state
        const adminContext = await browser.newContext({ storageState: 'adminAuth.json' });
        const adminPage = await adminContext.newPage();

        // Admin operation
        await adminPage.goto('https://practicesoftwaretesting.com/#/');
        await adminPage.locator('[data-test="nav-menu"]').click();
        await adminPage.locator('[data-test="nav-admin-messages"]').click();

        let lowerCasemsgSubject: string = msgSubject.toLowerCase();
        await adminPage.locator(`(//td[text()='${lowerCasemsgSubject}']/ancestor::tr)[1]//a`).click();
        await expect.soft(adminPage.locator(`//h2[text()='Replies']`)).toBeVisible();
        // await expect(adminPage.locator("//p[text()='Hi This is a test message to get customer service.']")).toHaveText("Hi This is a test message to get customer service.");
        await adminPage.locator('[data-test="message"]').fill('Hi, This is a test reply for customer from admin.');
        await adminPage.locator('[data-test="reply-submit"]').click();

        //Customer operations to check the reply
        //await customerPage.goto('https://practicesoftwaretesting.com/#/');
        // await customerPage.locator('[data-test="nav-messages"]').click();
        // await customerPage.getByRole('cell', { name: 'Details' }).first().click();
        // await expect(customerPage.getByText('Hi, This is a test reply for')).toHaveText("Hi, This is a test reply for the message inquiry.");
    });
});
