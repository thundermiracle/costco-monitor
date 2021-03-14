import puppeteer from "puppeteer";
import { getProductPriceDirectly } from "./core";

async function getPrice(): Promise<void> {
  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();
  // await page.goto("https://www.costco.co.jp/c/ECOVACS-DEEBOT-506/p/17884");

  const price = await getProductPriceDirectly(
    page,
    "https://www.costco.co.jp/Baby-Kids-Toys/Super-Mario-Odyssey/p/16896",
  );

  console.error("price:", price);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
getPrice();
