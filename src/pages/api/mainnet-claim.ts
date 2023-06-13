import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';
import provider from '@/lib/provider';
import env from '@/lib/env';
import { ZodError, z } from 'zod';
import { pino } from 'pino';
import { prismaOps } from '@/prisma';

const logger = pino();

type Data =
  | {
      from: string;
      to: string;
      value: string;
      nonce: string;
      hash: string;
      gas: string;
      status: string
    }
  | {
      message: string;
      error?: ZodError;
    };

const schema = z.object({
  account: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'Method Not Allowed',
    });
    return;
  }

  console.log(JSON.stringify(req.body, null, 2))

  const params = schema.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({
      message: 'Invalid request',
      error: params.error,
    });
    return;
  }
  const { account } = params.data;

  const claimValueInEth = env.CLAIM_VALUE

  const privateKey = env.FAUCET_PRIVATE_KEY;
  const signer = new ethers.Wallet(privateKey, provider);
  const from = signer.address;

  logger.info(`[claim] fromAddress: ${from}, toAddress: ${account}, amount(pCKB): ${claimValueInEth}`);

  // TODO: check assets in bridges

  const claimValueInWei = ethers.parseUnits(claimValueInEth.toString(), "ether")

  let dbTx;
  let tx;

  try {
    [dbTx, tx] = await prismaOps.create(
      from,
      account,
      async () => {
        return await signer.sendTransaction({
          to: account,
          value: claimValueInWei.toString(),
          gasLimit: 50000,
        })
      }
    )
  } catch (err: any) {
    return res.status(200).json({
      message: err.message,
    })
  }

  if (tx == null) {
    res.status(200).json({
      message: 'Already sent',
    });
    return;
  }

  const receipt = await tx.wait();
  const committedBlockNumber = receipt?.blockNumber;
  const result = {
    from,
    to: account,
    value: tx.value.toString(),
    nonce: tx.nonce.toString(),
    hash: tx.hash,
    gas: receipt!.gasUsed.toString(),
    status: receipt!.status!.toString(),
  };

  // Update to committed
  await prismaOps.updateToCommitted(dbTx.id, committedBlockNumber);

  logger.info(`[claim] tx: ${JSON.stringify(result)}`);

  res.status(200).json(result);

  await tx.wait(env.REQUIRED_CONFIRMATIONS);

  const receiptStatus = receipt?.status;
  if (receiptStatus === 1) {
    await prismaOps.updateToConfirmed(dbTx.id)
  } else if (receiptStatus === 0) {
    await prismaOps.updateToFailed(dbTx.id)
  }

  // TODO: update status when server stopped
}
