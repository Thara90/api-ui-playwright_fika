import { test, request, expect } from '@playwright/test';
import * as cartPayloadData from '../req-jsons/cartPayload.json';
import path from 'path';
import fs from 'fs/promises';
let token, cartId, product_price;

let cartPayload = { ...cartPayloadData };

test.describe('Example Test Suite', () => {

    test.beforeAll(async () => {

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

        //Get product id
        const productDetailsResponse = await apiContext.get(`${process.env.BASE_URL}/products?between=price,1,100&page=1`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        expect(loginResponse.ok()).toBeTruthy();
        const productDetailsResponseJson = await productDetailsResponse.json();
        const product_name = productDetailsResponseJson.data[0].name;
        const product_id = productDetailsResponseJson.data[0].id;
        product_price = productDetailsResponseJson.data[0].price;
        console.log("\n" + "##########################\n" + 'product_name : ' + product_name);
        console.log('product_id : ' + product_id);
        console.log('product_id : ' + product_price + "\n##########################");

        //writting product details into carePayload.json
        cartPayload.product_id = product_id;
        const filePath = path.join(__dirname, "../req-jsons", "cartPayload.json");
        const existingData = await fs.readFile(filePath, 'utf-8');
        const existingPayload = JSON.parse(existingData);
        existingPayload.product_id = product_id;
        await fs.writeFile(filePath, JSON.stringify(existingPayload, null, 2));

        //Create cart
        const creatCartResponse = await apiContext.post(`${process.env.BASE_URL}/carts`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        const creatCartResponseJson = await creatCartResponse.json();
        cartId = creatCartResponseJson.id;
        console.log("\n" + "##########################\n" + 'cart ID : ' + cartId + "\n##########################");

        //Add to Cart
        const addToCartResponse = await apiContext.post(`${process.env.BASE_URL}/carts/${cartId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: cartPayload
            }
        )
        const addToCartResponseJson = await addToCartResponse.json();
        console.log("\n" + "##########################\n");
        console.log(addToCartResponseJson);
    });

    test('Verify item price in cart', async ({ page }) => {
        page.addInitScript(value => {
            window.localStorage.setItem('auth-token', value);
        }, token);
        await page.goto(`${process.env.WEB_URL}/#/checkout`);
        page.addInitScript(value => {
            window.sessionStorage.setItem('cart_id', value);
        }, cartId);
        page.addInitScript(value => {
            window.sessionStorage.setItem('cart_quantity', value);
        }, '1');
        await page.reload();
        await expect.soft(page.locator('//tbody/tr/td[4]/span[1]')).toContainText(`${product_price}`);
        //await page.pause();
    });
});