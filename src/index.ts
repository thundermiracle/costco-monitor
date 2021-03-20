/* eslint-disable no-await-in-loop */
import dotenv from "dotenv";
import puppeteer from "puppeteer";
import { join } from "path";
import { getProductPriceDirectly, login } from "./core";
import priceRepository from "./db/priceRepository";
import mailer from "./mailer";
import logger from "./logger";

// read .env
dotenv.config({ path: join(__dirname, "../", ".env") });

async function main() {
  logger.info("**************Begin***************");
  const browser = await puppeteer.launch({
    headless: true,
    args:
      Boolean(process.env.NO_SANDBOX) === true
        ? ["--no-sandbox", "--disable-setuid-sandbox"]
        : [],
  });
  const page = await browser.newPage();

  if (process.env.Urls == null) {
    return;
  }
  const Urls = JSON.parse(process.env.Urls) as string[];

  // login first
  await login(page);
  logger.info("Login complete.");

  // price changed list
  const priceChangedList = [];

  for (let index = 0; index < Urls.length; index += 1) {
    const url = Urls[index];
    const latestPrice = await getProductPriceDirectly(page, url);

    const priceInfo = priceRepository.getLatestPrice(url);
    const priceBef = priceInfo == null ? 0 : priceInfo.price;

    logger.info(`[${url}]: [${priceBef}] vs [${latestPrice}]`);

    // save newest price & send mail if price changed
    if (latestPrice != null && priceBef !== latestPrice) {
      priceRepository.saveLatestPrice(url, latestPrice);

      priceChangedList.push({
        url,
        priceBef,
        latestPrice,
      });
    }
  }

  await browser.close();

  // send mail if price changed
  if (priceChangedList.length > 0) {
    const mailContents = priceChangedList
      .map(
        ({ url, priceBef, latestPrice }) => `
      <div>
        <div><span>【商品リンク】：</span>　${url}</div>
        <div><span>【旧価格】：</span>　¥${priceBef}</div>
        <div><span>【新価格】：</span>　¥${latestPrice}</div>
      </div>
    `,
      )
      .join("<br />");

    await mailer.sendMail("気に入りのコストコ商品の価格が変わりました", "", {
      html: mailContents,
    });
  }

  logger.info("Finished!");
}

main()
  .then()
  .catch((ex: Error) => {
    logger.error(ex.message);
  })
  .finally(() => {
    logger.info("**************End***************");
    process.exit();
  });
