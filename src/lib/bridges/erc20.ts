import { Wallet, ethers } from "ethers";
import { retry } from "./client";

// Test private key, no real meaning, only for call ERC20
const privateKey =
  "0x8888888888888888888888888888888888888888888888888888888888888888";
const godwokenMainnetURL = "https://v1.mainnet.godwoken.io/rpc";

export const erc20ABI = [
  "function totalSupply() public view returns (uint256)",
  "function decimals() public view returns (uint8)",
  "function name() public view returns (string memory)",
  "function symbol() public view returns (string memory)",
  "function balanceOf(address _owner) public view returns (uint256 balance)",
];

const provider = new ethers.JsonRpcProvider(godwokenMainnetURL);
const signer = new Wallet(privateKey, provider);

export interface ERC20Info {
  totalSupply: bigint;
  decimal: number;
  name: string;
  symbol: string;
}

export async function balanceOf(
  contractAddress: string,
  address: string,
): Promise<bigint> {
  const contract = new ethers.Contract(contractAddress, erc20ABI, signer);
  const balance: bigint = await retry(async () => contract.balanceOf(address))
  return balance
}
