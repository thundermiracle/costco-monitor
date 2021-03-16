import { getPriceFromString } from "../../src/utils";

describe("incorrect price", () => {
  it("no numbers", () => {
    const result = getPriceFromString("abc");
    expect(result).toBeNull();
  });

  it("null", () => {
    const result1 = getPriceFromString(null);
    const result2 = getPriceFromString(undefined);

    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });
});

describe("correct price", () => {
  it("without dot", () => {
    const result = getPriceFromString("¥1,400,000円");
    expect(result).toBe(1400000);
  });

  it("with dot", () => {
    const result = getPriceFromString("$1,400.50");
    expect(result).toBe(1400.5);
  });

  it("dot without int", () => {
    const result = getPriceFromString("a.5c");
    expect(result).toBe(0.5);
  });
});
