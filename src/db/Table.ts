import fs from "fs";
import { join } from "path";
import { filterData, SearchType } from "filter-data";

type SearchCondition = {
  key: string;
  value: string | number;
  type: SearchType;
};

type SearchConditionExtend<T> = {
  key: keyof T;
  value: any;
};

class Table<T> {
  private basePath = join(__dirname, "../../data");
  private tableFileName: string;
  private data: T[] = [];

  constructor(tableFileName: string) {
    this.tableFileName = tableFileName;

    // read data from file to memory
    this._reload();
  }

  all(): T[] {
    return this.data;
  }

  save(data: T[]): void {
    this.data = data;
    this._flush();
  }

  get(searchConditions: SearchCondition[]): T[] {
    return filterData(this.data, searchConditions);
  }

  upsert(inputData: T, searchCondition: SearchConditionExtend<T>): void {
    const { key, value } = searchCondition;
    const restData = this.data
      .map((d: T) => {
        return d[key] === value ? null : d;
      })
      .filter((x) => x != null) as T[];

    this.data = [...restData, inputData];

    this._flush();
  }

  private _flush(): void {
    const dataString = JSON.stringify(this.data);

    fs.writeFileSync(
      `${this.basePath}/${this.tableFileName}.json`,
      dataString,
      {
        encoding: "utf-8",
      },
    );
  }

  private _reload(): void {
    try {
      const rawData = fs.readFileSync(
        `${this.basePath}/${this.tableFileName}.json`,
        {
          encoding: "utf-8",
        },
      );

      this.data = JSON.parse(rawData) as T[];
    } catch {
      this.data = [];
    }
  }
}

export default Table;
