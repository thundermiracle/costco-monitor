/* eslint-disable no-await-in-loop */
import dotenv from "dotenv";
import puppeteer from "puppeteer";
import { join } from "path";
import { getProductPriceDirectly, login } from "./core";
import priceRepository from "./db/priceRepository";
import mailer from "./mailer";
import logger from "./logger";
import { getStockTextInfo } from "./utils";

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
    const [latestPrice, latestStockStatus] = await getProductPriceDirectly(
      page,
      url,
    );

    const priceInfo = priceRepository.getLatestPrice(url);
    const priceBef = priceInfo?.price || 0;
    const inStockBef = priceInfo?.inStock == null ? true : priceInfo?.inStock;

    logger.info(
      `[${url}]: [${priceBef}] vs [${latestPrice}]; [${getStockTextInfo(
        inStockBef,
      )}] vs [${getStockTextInfo(latestStockStatus)}]`,
    );

    // save newest price & send mail if price changed
    if (
      (latestPrice != null && priceBef !== latestPrice) || // 価格変更
      (latestPrice != null && inStockBef !== latestStockStatus) || // 在庫ステータス変更
      (latestPrice == null && !latestStockStatus) // 在庫切れ
    ) {
      priceRepository.saveLatestPrice(url, latestPrice, latestStockStatus);

      priceChangedList.push({
        url,
        priceBef,
        latestPrice,
        inStockBef,
        inStockNow: latestStockStatus,
      });
    }
  }

  await browser.close();

  // send mail if price changed
  if (priceChangedList.length > 0) {
    const mailContents = priceChangedList
      .map(
        ({ url, priceBef, latestPrice, inStockBef, inStockNow }) => `
      <div>
        <div><span>【商品リンク】：</span>　${url}</div>
        <div><span>【旧価格】：</span>　¥${priceBef}</div>
        <div><span>【新価格】：</span>　¥${latestPrice}</div>
        <div><span>【旧在庫】：</span>　${getStockTextInfo(inStockBef)}</div>
        <div><span>【新在庫】：</span>　${getStockTextInfo(inStockNow)}</div>
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
