import { Page } from "puppeteer";
import SelectorNames from "./SelectorNames";
import { getPriceFromString, getRandomUserAgent } from "./utils";

export async function getProductPriceDirectly(
  page: Page,
  url: string,
): Promise<number | null> {
  await page.setUserAgent(getRandomUserAgent());
  await page.goto(url);

  const priceString = await page.$eval(
    SelectorNames.PRICE,
    (el?: Element) => el?.textContent,
  );

  return getPriceFromString(priceString);
}
