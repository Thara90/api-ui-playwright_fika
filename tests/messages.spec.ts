import { test, expect } from '@playwright/test';

test.describe('Customer and Admin Operations', () => {

    test('Verify message flow between admin and customer', async ({ browser }) => {
        let msgSubject = 'Return';
        // Create a new browser context for the customer with saved authentication state
        const customerContext = await browser.newContext();
        const customerPage = await customerContext.newPage();

        await customerPage.goto(`${process.env.WEB_URL}`);
        await customerPage.locator('[data-test="nav-sign-in"]').click();
        await customerPage.locator('[data-test="email"]').fill('customer2@practicesoftwaretesting.com');
        await customerPage.locator('[data-test="password"]').fill('welcome01');
        await customerPage.locator('[data-test="login-submit"]').click();
        await customerPage.waitForTimeout(5000);
        await customerContext.storageState({path: 'customerAuth.json' });

        // Customer operations
        await customerPage.locator('[data-test="nav-contact"]').click();
        await customerPage.locator('[data-test="subject"]').selectOption(msgSubject);
        await customerPage.locator('[data-test="message"]').fill('Hi This is a test message to get customer service.');
        await customerPage.locator('[data-test="contact-submit"]').click();

        // Create a new browser context for the admin with saved authentication state
        const adminContext = await browser.newContext();
        const adminPage = await adminContext.newPage();

        await adminPage.goto(`${process.env.WEB_URL}`);
        await adminPage.locator('[data-test="nav-sign-in"]').click();
        await adminPage.locator('[data-test="email"]').fill('admin@practicesoftwaretesting.com');
        await adminPage.locator('[data-test="password"]').fill('welcome01');
        await adminPage.locator('[data-test="login-submit"]').click();
        await adminPage.waitForTimeout(5000);
        await adminContext.storageState({path: 'adminAuth.json' });

        // Admin operations
        await adminPage.goto('https://practicesoftwaretesting.com/#/admin/dashboard');
        await adminPage.locator('[data-test="nav-menu"]').click();
        await adminPage.locator('[data-test="nav-admin-messages"]').click();

        let lowerCasemsgSubject: string = msgSubject.toLowerCase();
        await adminPage.locator(`(//td[text()='${lowerCasemsgSubject}']/ancestor::tr)[1]//a`).click();
        // await expect(adminPage.locator("//p[text()='Hi This is a test message to get customer service.']")).toHaveText("Hi This is a test message to get customer service.");
        // await adminPage.locator('[data-test="message"]').fill('Hi, This is a test reply for the message inquiry.');
        // await adminPage.locator('[data-test="reply-submit"]').click();

        // // Customer operations to check the reply
        // await customerPage.goto('https://practicesoftwaretesting.com/#/account');
        // await customerPage.locator('[data-test="nav-messages"]').click();
        // await customerPage.getByRole('cell', { name: 'Details' }).first().click();
        // await expect(customerPage.getByText('Hi, This is a test reply for')).toHaveText("Hi, This is a test reply for the message inquiry.");
    });
});
