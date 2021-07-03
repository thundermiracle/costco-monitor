import { SearchType } from "filter-data";
import Table from "./Table";

interface IPrice {
  url: string;
  price: number | null;
  inStock: boolean;
  updated: Date;
}

interface IPriceRepository {
  getLatestPrice: (url: string) => IPrice | null;
  saveLatestPrice: (
    url: string,
    price: number | null,
    inStock: boolean,
  ) => IPrice;
}

class PriceRepository implements IPriceRepository {
  private priceTbl = new Table<IPrice>("price");

  getLatestPrice(url: string): IPrice | null {
    const targets = this.priceTbl.get([
      { key: "url", value: url, type: SearchType.EQ },
    ]);
    if (targets.length === 0) {
      return null;
    }

    return targets[0];
  }

  saveLatestPrice(url: string, price: number | null, inStock: boolean): IPrice {
    const priceData: IPrice = {
      url,
      price,
      inStock,
      updated: new Date(),
    };

    this.priceTbl.upsert(priceData, {
      key: "url",
      value: url,
    });

    return priceData;
  }
}

const priceRepository = new PriceRepository();

export default priceRepository;
