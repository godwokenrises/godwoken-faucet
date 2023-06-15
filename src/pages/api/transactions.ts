import { PrismaTransactionStatus } from '@/lib/constants';
import env from '@/lib/env';
import provider from '@/lib/provider';
import { prismaOps } from '@/prisma';
import { Transaction } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { pino } from 'pino';

const logger = pino();

(BigInt.prototype as any).toJSON = function() {
  return this.toString();
}

type Data = {
  transactions?: Transaction[];
  message?: string;
};

const DEFAULT_STATUS = [
  PrismaTransactionStatus.Failed,
  PrismaTransactionStatus.Pending,
  PrismaTransactionStatus.Confirmed,
  PrismaTransactionStatus.Committed,
] as number[];

const DEFAULT_PAGE_NUM = 0;
const DEFAULT_SIZE_LIMIT = 20;

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
  const { page, limit, status = DEFAULT_STATUS } = req.query;

  const pageNum = +(page as string) || DEFAULT_PAGE_NUM;
  const limitNum = +(limit as string) || DEFAULT_SIZE_LIMIT;

  const skip = pageNum * limitNum;
  const transactions = await prismaOps.transactions(status as number[], skip, limitNum);

  logger.info(`[transactions] ${JSON.stringify({
    pageNum,
    limitNum,
    status,
    transactions,
  })}`)

  res.status(200).json({
    transactions,
  });

  await Promise.all(
    transactions
      .filter(({ status }) => [
        PrismaTransactionStatus.Pending,
        PrismaTransactionStatus.Committed
      ].includes(status))
      .map(async ({ id, transactionHash }) => {
        const receipt = await provider.getTransactionReceipt(transactionHash);
        const confirmations = (await receipt?.confirmations()) ?? 0;
        if (confirmations > env.REQUIRED_CONFIRMATIONS) {
          await prismaOps.updateToConfirmed(id)
        }
      }),
  );
}
