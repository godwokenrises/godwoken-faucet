import { requestTo } from "./client";

const url = "https://raw.githubusercontent.com/godwokenrises/godwoken-info/main/mainnet_v1/bridged-token-list.json";

interface TokenStruct {
  name: string
  address: string
  decimal: number
}

async function getGodwokenTokens(): Promise<TokenStruct[]> {
  const res = await requestTo(url);
  const godwokenTokens: TokenStruct[] = (res as any[]).map(token => {
    let name = token.info.symbol.split("|")[0];
    if (name === "pCKB" || name === "dCKB") {
      name = "CKB"
    }
    return {
      name,
      address: token.erc20Info.ethAddress,
      decimal: token.info.decimals,
    }
  })
  return godwokenTokens;
}

let godwokenTokens: TokenStruct[] | undefined;
export async function getTokens(): Promise<TokenStruct[]> {
  if (godwokenTokens != null) {
    return godwokenTokens;
  }
  return await getGodwokenTokens();
}
