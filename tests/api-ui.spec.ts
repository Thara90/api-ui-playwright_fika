import { test, request, expect } from '@playwright/test';
import * as loginPayload from '../req-jsons/loginPayload.json';
import * as cartPayloadData from '../req-jsons/cartPayload.json';
import path from 'path';
import fs from 'fs/promises';
let token, cartId;

let cartPayload = { ...cartPayloadData };

test.describe('Example Test Suite', () => {

    test.beforeAll(async () => {

        //Login API
        const apiContext = await request.newContext();
        const loginResponse = await apiContext.post("https://api.practicesoftwaretesting.com/users/login",
            {
                data: loginPayload
            }
        )
        expect(loginResponse.ok()).toBeTruthy();
        const loginResponseJson = await loginResponse.json();
        token = loginResponseJson.access_token;
        console.log(loginResponseJson);

        //Get product id
        const productDetailsResponse = await apiContext.get("https://api.practicesoftwaretesting.com/products?between=price,1,100&page=1",
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: loginPayload
            }
        )
        expect(loginResponse.ok()).toBeTruthy();
        const productDetailsResponseJson = await productDetailsResponse.json();
        const product_name = productDetailsResponseJson.data[0].name;
        const product_id = productDetailsResponseJson.data[0].id;
        console.log('product_name : ' + product_name);
        console.log('product_id : ' + product_id);

        cartPayload.product_id = product_id;
        const filePath = path.join(__dirname, "../req-jsons", "cartPayload.json");
        const existingData = await fs.readFile(filePath, 'utf-8');
        const existingPayload = JSON.parse(existingData);
        existingPayload.product_id = product_id;
        await fs.writeFile(filePath, JSON.stringify(existingPayload, null, 2));

        //Create cart
        const cartResponse = await apiContext.post("https://api.practicesoftwaretesting.com/carts",
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        const cartResponseJson = await cartResponse.json();
        cartId = cartResponseJson.id;
        console.log(cartResponseJson);

        console.log('cart payload : ' + cartPayload);

        //Add to Cart
        const orderResponse = await apiContext.post(`https://api.practicesoftwaretesting.com/carts/${cartId}`,
            {
                data: cartPayload,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        const orderResponseJson = await orderResponse.json();
        console.log(orderResponseJson);
    });

    test('Verify item price in cart', async ({ page }) => {
        page.addInitScript(value => {
            window.localStorage.setItem('auth-token', value);
        }, token);
        await page.goto("https://practicesoftwaretesting.com/#/checkout");
        page.addInitScript(value => {
            window.sessionStorage.setItem('cart_id', value);
        }, cartId);
        page.addInitScript(value => {
            window.sessionStorage.setItem('cart_quantity', value);
        }, '1');
        await page.reload();
        await expect.soft(page.locator('//tbody/tr/td[4]/span[1]')).toContainText('$14.15');
        //await page.pause();
    });
});