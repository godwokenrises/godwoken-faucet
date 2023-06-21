import { requestTo } from "./client";

const TOKEN_URL = "https://cbridge-prod2.celer.app/v1/getTransferConfigsForAll";

interface TokenStruct {
  token: {
    symbol: string;
    address: string;
    decimal: number;
  };
  name: string;
}

async function getGodwokenTokens(): Promise<TokenStruct[]> {
  const res = await requestTo(TOKEN_URL);
  const chainTokens = res.chain_token;
  const godwokenTokens: TokenStruct[] = chainTokens["71402"].token;
  return godwokenTokens;
}

let godwokenTokens: TokenStruct[] | undefined;
export async function tokens(): Promise<TokenStruct[]> {
  if (godwokenTokens != null) {
    return godwokenTokens;
  }
  godwokenTokens = await getGodwokenTokens();
  return godwokenTokens;
}
