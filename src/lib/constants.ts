export enum TransactionStatus {
  Pending = 0,
  Confirmed = 1,
  Failed = 2,
}

export enum PrismaTransactionStatus {
  // after send succeed
  Pending = 1,
  // transaction
  Committed = 2,
  Confirmed = 3,
  Failed = 4,
}
