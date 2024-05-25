import { chromium, FullConfig } from "@playwright/test";
import * as dotenv from 'dotenv';

async function globalSetup(config: FullConfig) {
    dotenv.config({
        path: `.env`,
        override: true
    });

    // // Create a browser context and login as customer
    // const customerBrowser = await chromium.launch();
    // const customerContext = await customerBrowser.newContext();
    // const customerPage = await customerContext.newPage();
    // await customerPage.goto('https://practicesoftwaretesting.com/#/auth/login');
    // await customerPage.locator('[data-test="email"]').fill('customer2@practicesoftwaretesting.com');
    // await customerPage.locator('[data-test="password"]').fill('welcome01');
    // await customerPage.locator('[data-test="login-submit"]').click();
    // await customerPage.waitForSelector('[data-test="nav-menu"]');
    // await customerContext.storageState({ path: 'customerAuth.json' });
    // await customerBrowser.close();

    // // Create a browser context and login as admin
    // const adminBrowser = await chromium.launch();
    // const adminContext = await adminBrowser.newContext();
    // const adminPage = await adminContext.newPage();
    // await adminPage.goto('https://practicesoftwaretesting.com/#/auth/login');
    // await adminPage.locator('[data-test="email"]').fill('admin@practicesoftwaretesting.com');
    // await adminPage.locator('[data-test="password"]').fill('welcome01');
    // await adminPage.locator('[data-test="login-submit"]').click();
    // await adminPage.waitForSelector('[data-test="nav-menu"]');
    // await adminContext.storageState({ path: 'adminAuth.json' });
    // await adminBrowser.close();
}
export default globalSetup;