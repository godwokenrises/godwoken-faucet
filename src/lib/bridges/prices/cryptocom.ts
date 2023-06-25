import { requestTo } from "../client";
import { PriceInfos } from "./base";

// https://api.crypto.com/v2/public/get-instruments
export async function cryptocomPrices(allSymbols: Set<string>): Promise<PriceInfos> {
  const instrumentName2Symbol = await allPrices(allSymbols);

  const priceInfos: PriceInfos = new Map();
  for (const [ instrument_name, symbol ] of instrumentName2Symbol) {
    const url = `https://api.crypto.com/v2/public/get-trades?instrument_name=${instrument_name}`;

    const result = await requestTo(url);
    const price: string = result.result.data[0].p;
    priceInfos.set(symbol, price);
  }

  return priceInfos;
}

// Coin list: https://api.crypto.com/v2/public/get-instruments
// return instrument_name => symbol Map
async function allPrices(allSymbols: Set<string>): Promise<Map<string, string>> {
  const arr = Array.from(allSymbols);
  allSymbols = new Set( arr.map(i => i.toUpperCase()) );

  const result = await requestTo("https://api.crypto.com/v2/public/get-instruments")
  const infos: { instrument_name: string, base_currency: string, quote_currency: string }[] = result.result.instruments;
  const allIds = new Map<string, string>();

  infos.forEach(i => {
    if (i.quote_currency === "USD" && allSymbols.has(i.base_currency.toUpperCase())) {
      allIds.set(i.instrument_name, i.base_currency);
    }
  })

  return allIds;
}
