import { PrismaTransactionStatus } from '@/lib/constants';
import { PrismaClient, Transaction } from '@prisma/client';
import { ethers } from 'ethers';

export class PrismaOps {
  private prisma = new PrismaClient();

  constructor() {}

  async create(
    from: string,
    to: string,
    func: () => Promise<ethers.TransactionResponse>,
  ): Promise<[Transaction, ethers.TransactionResponse | undefined]> {
    return await this.prisma.$transaction(async tx => {
      const one = await tx.transaction.findFirst({
        where: {
          to,
          NOT: {
            status: PrismaTransactionStatus.Failed,
          }
        },
      })

      if (one != null) {
        return [one, undefined];
      }

      const ttx = await func();
      const txHash = ttx.hash;

      const result = await tx.transaction.create({
        data: {
          from,
          to,
          transactionHash: txHash,
          status: PrismaTransactionStatus.Pending,
        }
      })

      return [result, ttx]
    })
  }

  async updateToCommitted(id: number, blockNumber?: number) {
    return await this.updateStatus(id, PrismaTransactionStatus.Committed, blockNumber)
  }

  async updateToConfirmed(id: number) {
    return await this.updateStatus(id, PrismaTransactionStatus.Confirmed)
  }

  // TODO: update to failed OR delete this ?
  async updateToFailed(id: number) {
    return await this.updateStatus(id, PrismaTransactionStatus.Failed)
  }

  private async updateStatus(
    id: number,
    status: PrismaTransactionStatus,
    blockNumber?: number
  ) {
    const now = new Date();
    const result = await this.prisma.transaction.update({
      where: {
        id,
      },
      data: {
        status,
        updatedAt: now,
        blockNumber
      }
    })

    return result
  }
}

export const prismaOps = new PrismaOps();
