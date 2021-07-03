export function getPriceFromString(
  priceStr: string | null | undefined,
): number | null {
  if (priceStr == null) {
    return null;
  }

  const purifiedPriceStr = priceStr.replace(/[^0-9.]/g, "");
  if (purifiedPriceStr.length === 0) {
    return null;
  }

  return Number(purifiedPriceStr);
}

const UserAgents = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4298.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",
];

export function getRandomUserAgent(): string {
  const ind = Math.floor(Math.random() * UserAgents.length);
  return UserAgents[ind];
}

export function getStockTextInfo(isInStock: boolean): string {
  return isInStock ? "在庫あり" : "在庫切れ";
}
