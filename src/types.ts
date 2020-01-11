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
