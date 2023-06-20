import Decimal from "decimal.js";
import { binancePrices } from "./binance";
import { coingeckoPrices } from "./coingecko";
import { cryptocomPrices } from "./cryptocom";
import { PriceInfos } from "./base";
import { pino } from "pino";

const logger = pino()

export async function averagePriceInfos(allSymbols: Set<string>): Promise<PriceInfos> {
  let failedPriceInfos = 0;

  let binancePriceInfos: PriceInfos = new Map<string, string>();
  let coingeckoPriceInfos: PriceInfos = new Map<string, string>();
  let cryptocomPriceInfos: PriceInfos = new Map<string, string>();

  try {
    binancePriceInfos = await binancePrices(allSymbols);
  } catch (err) {
    logger.error(`request to binance failed`);
    failedPriceInfos += 1;
  }

  try {
    coingeckoPriceInfos = await coingeckoPrices(allSymbols);
  } catch (err) {
    logger.error(`request to coingecko failed`)
    failedPriceInfos += 1;
  }

  try {
    cryptocomPriceInfos = await cryptocomPrices(allSymbols);
  } catch (err) {
    logger.error(`request to crypto.com failed`)
    failedPriceInfos += 1;
  }

  if (failedPriceInfos === 0) {
    throw new Error(`all request to exchanges are failed, no token price info get`)
  }

  const getPrices = (symbol: string): Decimal[] => {
    const binancePrice: string | undefined = binancePriceInfos.get(symbol);
    const coingeckoPrice: string | undefined = coingeckoPriceInfos.get(symbol);
    const cryptocomPrice: string | undefined = cryptocomPriceInfos.get(symbol);

    return [binancePrice, coingeckoPrice, cryptocomPrice]
      .filter((p) => p !== undefined)
      .map((p) => new Decimal(p!));
  };

  const priceInfos: PriceInfos = new Map();

  for (const symbol of allSymbols) {
    const prices = getPrices(symbol);

    // median
    if (prices.length === 3) {
      const medianPrice = prices.sort((a, b) =>
        new Decimal(a).sub(new Decimal(b)).toNumber()
      )[1];
      priceInfos.set(symbol, medianPrice.toString());
    }

    if (prices.length === 2) {
      const averagePrice: Decimal = prices[0].plus(prices[1]).div(2);
      priceInfos.set(symbol, averagePrice.toString());
    }

    if (prices.length === 1) {
      priceInfos.set(symbol, prices[0].toString());
    }
  }
  return priceInfos;
}
