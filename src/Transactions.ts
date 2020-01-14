import { Transaction } from './types';

// tslint:disable-next-line:completed-docs
export class Transactions {
  private readonly transactionMap: Map<string, Transaction>;
  private transactionsBlock: string;

  constructor(transactionMap: Map<string, Transaction>) {
    this.transactionMap = transactionMap;
    this.generateTransactionsBlock();
  }

  public addTransaction(transaction: Transaction): void {
    if (!this.transactionMap.has(transaction.idLine)) {
      this.transactionMap.set(transaction.idLine, transaction);
      this.generateTransactionsBlock();
    }
  }

  public deleteTransaction(transaction: Transaction): void {
    if (this.transactionMap.has(transaction.idLine)) {
      this.transactionMap.delete(transaction.idLine);
      this.generateTransactionsBlock();
    }
  }

  public getTransactionsBlock(): string {
    return this.transactionsBlock;
  }

  private generateTransactionsBlock(): void {
    let str = '';

    for (const [, transaction] of this.transactionMap) {
      str += transaction.transactionForBlock;
    }

    this.transactionsBlock = str;
  }

}
