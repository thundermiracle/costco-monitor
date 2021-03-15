import { Page } from "puppeteer";
import Constants from "./config/Constants";
import SelectorNames, { ISelectorNames } from "./config/SelectorNames";
import { getPriceFromString, getRandomUserAgent } from "./utils";

/* ************************ */
/* Private functions 　　　　*/
/* ************************ */
async function redirect(page: Page, url: string): Promise<void> {
  await page.setUserAgent(getRandomUserAgent());
  await page.goto(url, { timeout: 0 });
}

async function retrievePriceFromPage(page: Page): Promise<number | null> {
  // Throws error if elment not exists
  // const priceString = await page.$eval(
  //   SelectorNames.PRICE,
  //   (el?: Element) => el?.textContent,
  // );

  const priceString = await page.evaluate(
    (selectorNames: ISelectorNames) => {
      // Get normal price
      let priceDom = document.querySelector(selectorNames.PRICE);

      // if priceDom is null, try to get discount price
      if (priceDom == null) {
        priceDom = document.querySelector(selectorNames.PRICE_DISCOUNT);
      }

      return priceDom?.textContent;
    },
    { ...SelectorNames },
  );

  return getPriceFromString(priceString);
}
/* End of private functions */

/**
 * try to get price of product without login, if login is required, returns null
 *
 * @param page
 * @param productUrl
 * @returns
 */
export async function getProductPriceDirectly(
  page: Page,
  productUrl: string,
): Promise<number | null> {
  await redirect(page, productUrl);

  const price = await retrievePriceFromPage(page);
  return price;
}

export async function login(page: Page): Promise<void> {
  if (!process.env.COSTCO_USER || !process.env.COSTCO_PASS) {
    throw new Error("COSTCO_USER & COSTCO_PASS MUST be defined in .env");
  }

  await redirect(page, Constants.COSTCO_LOGIN_URL);

  await page.type(SelectorNames.LOGIN_EMAIL, process.env.COSTCO_USER);
  await page.type(SelectorNames.LOGIN_PASSWORD, process.env.COSTCO_PASS);
  await page.click(SelectorNames.LOGIN_BUTTON);
}

/**
 * Get product price after login is finished
 * @param page
 * @param productUrl
 */
export async function getProductPriceAfterLogin(
  page: Page,
  productUrl: string,
): Promise<number | null> {
  await login(page);

  const price = await getProductPriceDirectly(page, productUrl);
  return price;
}
