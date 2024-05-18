import { FullConfig } from "@playwright/test";
import * as dotenv from 'dotenv';

async function globalSetup(config: FullConfig) {
        dotenv.config({
            path: `.env`,
            override: true
        });
}
export default globalSetup;