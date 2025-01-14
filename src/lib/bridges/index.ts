import Decimal from "decimal.js";
import * as Celer from "./celer";
import * as Multichain from "./multichain";
import * as GodwokenBridge from "./mainnet_bridged_token_list";
import * as AveragePrice from "./prices/average";
import { balanceOf } from "./erc20";
import { convertBalance } from "../utils";
import env from "../env";

const REMOVE_SYMBOLS: string[] = [];
const removeSymbols: Set<string> = new Set<string>(
  REMOVE_SYMBOLS.map((s) => s.toUpperCase())
);

async function getBalanceInUSD(
  tokenAddress: string,
  address: string,
  decimal: number,
  pirce: Decimal
): Promise<Decimal> {
  const balanceInMinUnit: bigint = await balanceOf(tokenAddress, address);
  const balance: Decimal = convertBalance(
    new Decimal(balanceInMinUnit.toString()),
    decimal
  );
  const balanceInUSD: Decimal = balance.mul(pirce);
  return balanceInUSD;
}

export async function hasEnoughUSD(address: string): Promise<boolean> {
  const celerTokens = await Celer.tokens();
  const godwokenBridgeTokens = await GodwokenBridge.tokens();

  const multichainSymbols = Object.keys(Multichain.tokens);
  const celerSymbols = celerTokens.map((t) => t.token.symbol);
  const godwokenBridgeSymbols = godwokenBridgeTokens.map((t) => t.name);
  const allSymbols = new Set(
    multichainSymbols
      .concat(celerSymbols)
      .concat(godwokenBridgeSymbols)
      .filter((s) => !removeSymbols.has(s.toUpperCase()))
  );

  const priceInfos = await AveragePrice.prices(allSymbols);
  let totalBalanceInUSD = new Decimal(0);

  // Multichain
  for (const [tokenName, { address: tokenAddress, decimal }] of Object.entries(
    Multichain.tokens
  )) {
    const price: string | undefined = priceInfos.get(tokenName);
    if (price == null) {
      continue;
    }

    const priceInDecimal: Decimal = new Decimal(price);

    const balanceInUSD: Decimal = await getBalanceInUSD(
      tokenAddress,
      address,
      decimal,
      priceInDecimal
    );

    totalBalanceInUSD = totalBalanceInUSD.plus(balanceInUSD);
    if (totalBalanceInUSD.greaterThanOrEqualTo(env.REQUIRED_USD)) {
      return true;
    }
  }

  // Celer
  // const celerTokens = await getCelerTokens();
  for (const token of celerTokens) {
    const price: string | undefined = priceInfos.get(token.name);
    if (price == null) {
      continue;
    }

    const priceInDecimal: Decimal = new Decimal(price);
    const balanceInUSD: Decimal = await getBalanceInUSD(
      token.token.address,
      address,
      token.token.decimal,
      priceInDecimal
    );

    totalBalanceInUSD = totalBalanceInUSD.plus(balanceInUSD);

    if (totalBalanceInUSD.greaterThanOrEqualTo(env.REQUIRED_USD)) {
      return true;
    }
  }

  // Godwoken Bridge
  // const godwokenBridgeTokens = await getGodwokenBridgeTokens();
  for (const token of godwokenBridgeTokens) {
    const price: string | undefined = priceInfos.get(token.name);
    if (price == null) {
      continue;
    }

    const priceInDecimal: Decimal = new Decimal(price);
    const balanceInUSD: Decimal = await getBalanceInUSD(
      token.address,
      address,
      token.decimal,
      priceInDecimal
    );

    totalBalanceInUSD = totalBalanceInUSD.plus(balanceInUSD);
    if (totalBalanceInUSD.greaterThanOrEqualTo(env.REQUIRED_USD)) {
      return true;
    }
  }

  return false;
}
