import { z } from "zod";

export interface IEnv {
  CLAIM_VALUE: number
  GODWOKEN_RPC_URL: string
  REQUIRED_CONFIRMATIONS: number
  FAUCET_PRIVATE_KEY: string
  RECEIVING_TIME_LIMIT: number
  REQUIRED_USD: number
}

const schema = z.object({
  GODWOKEN_RPC_URL: z.string(),
  FAUCET_PRIVATE_KEY: z.string(),
  // optional
  REQUIRED_CONFIRMATIONS: z.string().optional(),
  CLAIM_VALUE: z.string().optional(),
  RECEIVING_TIME_LIMIT: z.string().optional(),
  REQUIRED_USD: z.string().optional(),
});

const env = schema.parse(process.env);

const CLAIM_VALUE: number = +(env.CLAIM_VALUE || 30);
const REQUIRED_CONFIRMATIONS: number = +(env.REQUIRED_CONFIRMATIONS || 10);
const RECEIVING_TIME_LIMIT: number = +(env.RECEIVING_TIME_LIMIT || 1);
const REQUIRED_USD = +(env.REQUIRED_USD || 0);


export default {
  ...env,
  CLAIM_VALUE,
  REQUIRED_CONFIRMATIONS,
  RECEIVING_TIME_LIMIT,
  REQUIRED_USD,
} as IEnv;

