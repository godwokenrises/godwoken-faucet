import { PrismaTransactionStatus } from "@/lib/constants";
import env from "@/lib/env";
import { PrismaClient, Transaction } from "@prisma/client";
import { ethers } from "ethers";

export class PrismaOps {
  private prisma = new PrismaClient();

  constructor() {}

  async transactions(status: number[], skip: number, limit: number) {
    const result = await this.prisma.transaction.findMany({
      where: {
        status: {
          in: status,
        },
      },
      skip,
      take: limit,
      orderBy: {
        id: "desc",
      },
    });
    return result;
  }

  async create(
    from: string,
    to: string,
    func: () => Promise<ethers.TransactionResponse>
  ): Promise<[Transaction, ethers.TransactionResponse] | undefined> {
    return await this.prisma.$transaction(async (tx) => {
      const txCount = await tx.transaction.count({
        where: {
          to,
          NOT: {
            status: PrismaTransactionStatus.Failed,
          },
        },
      });

      if (txCount >= env.RECEIVING_TIME_LIMIT) {
        return undefined;
      }

      const ttx = await func();
      const txHash = ttx.hash;

      const result = await tx.transaction.create({
        data: {
          from,
          to,
          transactionHash: txHash,
          value: ttx.value.toString(),
          status: PrismaTransactionStatus.Pending,
        },
      });

      return [result, ttx];
    });
  }

  async updateToCommitted(id: number, blockNumber?: number) {
    return await this.updateStatus(
      id,
      PrismaTransactionStatus.Committed,
      blockNumber
    );
  }

  async updateToConfirmed(id: number) {
    return await this.updateStatus(id, PrismaTransactionStatus.Confirmed);
  }

  // TODO: update to failed OR delete this ?
  async updateToFailed(id: number) {
    return await this.updateStatus(id, PrismaTransactionStatus.Failed);
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
        blockNumber,
      },
    });

    return result;
  }
}

export const prismaOps = new PrismaOps();
