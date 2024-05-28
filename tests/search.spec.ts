import { test, request, expect } from '@playwright/test';
import * as qaTestData from '../test-data/qaTestData.json';
import * as regTestData from '../test-data/regTestData.json';
let token;

test.describe('Search Test Suite', () => {
    let testData = qaTestData;
    if (process.env.ENV == 'reg') {
        testData = regTestData;
    }
    test.beforeEach(async ({ page }) => {
        //login
        await page.goto(`${process.env.WEB_URL}`);
        await page.locator('[data-test="nav-sign-in"]').click();
        await page.locator('[data-test="email"]').fill('customer2@practicesoftwaretesting.com');
        await page.locator('[data-test="password"]').fill('welcome01');
        await page.locator('[data-test="login-submit"]').click();
        await page.waitForSelector('[data-test="nav-menu"]');
    });

    for (const productList of testData.products) {
        test(`Verify searching for ${productList.productName}`, async ({ page }) => {
            await page.goto(`${process.env.WEB_URL}/#/`);
            await page.locator('[data-test="search-query"]').fill(productList.productName);
            await page.locator('[data-test="search-submit"]').click();
            await page.waitForTimeout(3000);
            await expect.soft(page.locator(`//h5[@data-test='product-name']`)).toContainText(productList.productName);
        });
    }
});