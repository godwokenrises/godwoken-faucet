import { ethers } from "ethers";
import env from "./env";

const provider = new ethers.JsonRpcProvider(env.GODWOKEN_RPC_URL);

export default provider;
