/* eslint-disable no-await-in-loop */
import dotenv from "dotenv";
import puppeteer from "puppeteer";
import Urls from "./config/Urls";
import { getProductPriceDirectly, login } from "./core";
import priceRepository from "./db/priceRepository";
import mailer from "./mailer";

// read .env
dotenv.config();

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // login first
  await login(page);

  // price changed list
  const priceChangedList = [];

  for (let index = 0; index < Urls.length; index += 1) {
    const url = Urls[index];
    const latestPrice = await getProductPriceDirectly(page, url);

    const priceInfo = priceRepository.getLatestPrice(url);
    const priceBef = priceInfo == null ? 0 : priceInfo.price;

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

  // send mail if price changed
  if (priceChangedList.length > 0) {
    const mailContents = priceChangedList
      .map(
        ({ url, priceBef, latestPrice }) => `
      <div>
        <div><span>【商品リンク】：</span>　¥${url}</div>
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
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
