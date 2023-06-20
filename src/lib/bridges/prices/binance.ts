import { requestTo } from "../client";
import { PriceInfos } from "./base";

export async function binancePrices(
  allSymbols: Set<string>
): Promise<PriceInfos> {
  const priceInfos: PriceInfos = new Map();
  const prices = await binancePrice();

  // PUSH USDT
  priceInfos.set("USDT", "1");

  for (const symbol of allSymbols) {
    const price: string | undefined = getBinancePrice(symbol, prices);
    if (price != null) {
      priceInfos.set(symbol, price);
    }
  }

  return priceInfos;
}

type BinancePriceInfo = Map<string, string>;

async function binancePrice(): Promise<Map<string, string>> {
  const url = "https://www.binance.com/api/v3/ticker/price";
  const result: { symbol: string; price: string }[] = await requestTo(url);
  const infos = result.reduce((map, obj) => {
    // map[obj.symbol] = obj.price;
    map.set(obj.symbol, obj.price);
    return map;
  }, new Map());
  return infos;
}

export function getBinancePrice(
  coinSymbol: string,
  infos: BinancePriceInfo
): string | undefined {
  return infos.get(`${coinSymbol}USD`) || infos.get(`${coinSymbol}USDT`);
}
