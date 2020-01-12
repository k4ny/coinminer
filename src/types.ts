export type BlockChain = {
  Digest: string;
  TimeStamp: Date;
  Difficulty: number;
  Miner: string;
  Transactions: any;
};

export type  State = {
  Digest: string;
  Difficulty: number;
  Fee: number;
};

export type Transaction = {
  validTo: Date;
  transLine: string;
  dataLine1: string;
  dataLine2: string;
  feeLine: string;
  idLine: string;
  validToLine: string;
  transactionForBlock: string;
};
