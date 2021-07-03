import { Page } from "puppeteer";
import Constants from "./config/Constants";
import SelectorNames, { ISelectorNames } from "./config/SelectorNames";
import { getPriceFromString, getRandomUserAgent } from "./utils";

type PriceInfo = [number | null, boolean];

/* ************************ */
/* Private functions 　　　　*/
/* ************************ */
async function redirect(page: Page, url: string): Promise<void> {
  await page.setUserAgent(getRandomUserAgent());
  await page.goto(url, { timeout: 0 });
}

async function retrievePriceInfoFromPage(page: Page): Promise<PriceInfo> {
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

  const inStock = await page.evaluate(
    (selectorNames: ISelectorNames) => {
      // Get 再入荷のお知らせボタン
      const notifyWhenInStockDom = document.querySelector(
        selectorNames.NOTIFY_WHEN_IN_STOCK,
      );
      const isInStock = notifyWhenInStockDom == null;

      return isInStock;
    },
    { ...SelectorNames },
  );

  return [getPriceFromString(priceString), inStock];
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
): Promise<PriceInfo> {
  await redirect(page, productUrl);

  const priceInfo = await retrievePriceInfoFromPage(page);
  return priceInfo;
}

export async function login(page: Page): Promise<void> {
  if (!process.env.CostcoUser || !process.env.CostcoPass) {
    throw new Error("CostcoUser & CostcoPass MUST be defined in .env");
  }

  await redirect(page, Constants.COSTCO_LOGIN_URL);

  await page.type(SelectorNames.LOGIN_EMAIL, process.env.CostcoUser);
  await page.type(SelectorNames.LOGIN_PASSWORD, process.env.CostcoPass);
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
): Promise<PriceInfo> {
  await login(page);

  const priceInfo = await getProductPriceDirectly(page, productUrl);
  return priceInfo;
}
