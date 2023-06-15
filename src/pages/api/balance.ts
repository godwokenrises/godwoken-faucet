import env from '@/lib/env';
import provider from '@/lib/provider';
import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';
import { pino } from 'pino';

const logger = pino();

type Data =
  | {
      balance: string;
    }
  | {
      message?: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== 'GET') {
    res.status(405).json({
      message: 'Method Not Allowed',
    });
    return;
  }

  const signer = new ethers.Wallet(env.FAUCET_PRIVATE_KEY, provider);
  const from = signer.address;
  const balance: bigint = await provider.getBalance(from);

  logger.info(`[balance] ${balance}`);

  res.status(200).json({
    balance: balance.toString(),
  });
}
