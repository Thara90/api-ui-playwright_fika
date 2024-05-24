import { test, request, expect } from '@playwright/test';
import * as qaTestData from '../test-data/qaTestData.json';
import * as regTestData from '../test-data/regTestData.json';
let token;

test.describe('Search Test Suite', () => {
    let testData = qaTestData;
    if (process.env.ENV == 'reg') {
        testData = regTestData;
    }
    test.beforeEach(async () => {

        //Login API
        const apiContext = await request.newContext();
        const loginResponse = await apiContext.post(`${process.env.BASE_URL}/users/login`,
            {
                data: {
                    email: `${process.env.USERNAME}`,
                    password: `${process.env.PASSWORD}`
                }
            }
        )
        expect(loginResponse.ok()).toBeTruthy();
        const loginResponseJson = await loginResponse.json();
        token = loginResponseJson.access_token;
        console.log("##########################\n" + token + "\n##########################");
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