import { test, request, expect } from '@playwright/test';
const loginPayload = { email: "customer2@practicesoftwaretesting.com", password: "welcome01" }
const orderPayload = { product_id: "01HW4ZG8550TCQ5D60RE89S7SM", quantity: 1 }
let token, cartId;

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

        //Get user's details
        const response = await apiContext.get("https://api.practicesoftwaretesting.com/users/me",
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        expect.soft(response.status()).toBe(200);
        const body = await response.json();
        console.log(JSON.stringify(body));

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

        //Add to Cart
        const orderResponse = await apiContext.post(`https://api.practicesoftwaretesting.com/carts/${cartId}`,
            {
                data: orderPayload,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )
        const orderResponseJson = await orderResponse.json();
        console.log(orderResponseJson);
    });

    test('Load cart', async ({ page }) => {
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
        await page.pause();
    });
});