import { z } from "zod";

export interface IEnv {
  AXON_FAUCET_REQUIRED_CONFIRMATIONS: number,
  AXON_FAUCET_CLAIM_VALUE: number,
  AXON_FAUCET_RPC_URL: string,
  AXON_FAUCET_CHAIN_ID: number,
  AXON_FAUCET_MONGODB_URL: string,
  AXON_FAUCET_MONGODB_DB: string,
  AXON_FAUCET_MONGODB_TRANSACTIONS_COLLECTION: string;
  AXON_FAUCET_MONGODB_ADDRESSES_COLLECTION: string;

  CLAIM_VALUE: number
  GODWOKEN_RPC_URL: string
  REQUIRED_CONFIRMATIONS: number
  FAUCET_PRIVATE_KEY: string
  RECEIVING_TIME_LIMIT: number
  IS_MAINNET: boolean
}

const schema = z.object({
  AXON_FAUCET_REQUIRED_CONFIRMATIONS: z.string(),
  AXON_FAUCET_CLAIM_VALUE: z.string(),
  AXON_FAUCET_RPC_URL: z.string(),
  AXON_FAUCET_CHAIN_ID: z.string(),
  AXON_FAUCET_MONGODB_URL: z.string(),
  AXON_FAUCET_MONGODB_DB: z.string(),
  AXON_FAUCET_MONGODB_TRANSACTIONS_COLLECTION: z.string(),
  AXON_FAUCET_MONGODB_ADDRESSES_COLLECTION: z.string(),

  GODWOKEN_RPC_URL: z.string(),
  FAUCET_PRIVATE_KEY: z.string(),
  // optional
  REQUIRED_CONFIRMATIONS: z.string().optional(),
  CLAIM_VALUE: z.string().optional(),
  RECEIVING_TIME_LIMIT: z.string().optional(),
  IS_MAINNET: z.string().optional(),
});

const env = schema.parse(process.env);
const AXON_FAUCET_REQUIRED_CONFIRMATIONS = parseInt(env.AXON_FAUCET_REQUIRED_CONFIRMATIONS, 10);
const AXON_FAUCET_CLAIM_VALUE = parseInt(env.AXON_FAUCET_CLAIM_VALUE, 10);
const AXON_FAUCET_CHAIN_ID = parseInt(env.AXON_FAUCET_CHAIN_ID, 10);

const CLAIM_VALUE: number = +(env.CLAIM_VALUE || 30);
const REQUIRED_CONFIRMATIONS: number = +(env.REQUIRED_CONFIRMATIONS || 10);
const IS_MAINNET: boolean = env.IS_MAINNET === "true";
const defaultReceivingTimeLimit: number = IS_MAINNET ? 1 : 1000;
const RECEIVING_TIME_LIMIT: number = +(env.RECEIVING_TIME_LIMIT || defaultReceivingTimeLimit);


export default {
  ...env,
  AXON_FAUCET_REQUIRED_CONFIRMATIONS,
  AXON_FAUCET_CLAIM_VALUE,
  AXON_FAUCET_CHAIN_ID,
  CLAIM_VALUE,
  REQUIRED_CONFIRMATIONS,
  RECEIVING_TIME_LIMIT,
  IS_MAINNET,
} as IEnv;

