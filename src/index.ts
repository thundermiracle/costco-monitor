/* eslint-disable no-await-in-loop */
import dotenv from "dotenv";
import puppeteer from "puppeteer";
import Urls from "./config/Urls";
import { getProductPriceDirectly, login } from "./core";

// read .env
dotenv.config();

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // login first
  await login(page);

  for (let index = 0; index < Urls.length; index += 1) {
    const url = Urls[index];
    const latestPrice = await getProductPriceDirectly(page, url);

    console.log(latestPrice);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
