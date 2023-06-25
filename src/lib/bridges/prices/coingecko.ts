import { requestTo } from "../client";
import { PriceInfos } from "./base";

export async function coingeckoPrices(allSymbols: Set<string>): Promise<PriceInfos> {
  const id2SymbolMap = await allPrices(allSymbols);
  const tokenIds = Array.from(id2SymbolMap).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=usd`;
  const coinPrices: { [key: string]: { usd: number } } = await requestTo(url);

  const priceInfos = new Map();
  Object.entries(coinPrices).forEach((o) => {
    const key = o[0];
    const value = o[1];
    const symbol = id2SymbolMap.get(key);
    const price = value.usd.toString();
    priceInfos.set(symbol, price);
  });

  return priceInfos;
}

// Coin list: https://api.coingecko.com/api/v3/coins/list
// return id => symbol Map
async function allPrices(allSymbols: Set<string>): Promise<Map<string, string>> {
  const arr = Array.from(allSymbols);
  allSymbols = new Set( arr.map(i => i.toUpperCase()) );
  const symbolInfos: { id: string, symbol: string, name: string }[] = await requestTo("https://api.coingecko.com/api/v3/coins/list")
  const allIds = new Map<string, string>();

  symbolInfos.forEach(i => {
    if (allSymbols.has(i.symbol.toUpperCase())) {
      allIds.set(i.id, i.symbol);
    }
  })

  return allIds;
}

