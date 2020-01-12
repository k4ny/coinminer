import { NL, TAB } from './consts';
export interface Transaction {
  validTo: Date;
  transLine: string;
  dataLine1: string;
  dataLine2: string;
  feeLine: string;
  idLine: string;
  validToLine: string;
}

// tslint:disable-next-line:completed-docs
export class YamlParser {

  public parseTransactions(yaml: string): Transaction[] {
    const lines = yaml.split(NL);

    const transactions: Transaction[] = [];

    for (let i = 0; i <= lines.length - 6; i = i + 6) {
      const transaction = this.parseTransaction(lines.slice(i, i + 6));
      transactions.push(transaction);
    }

    return transactions;
  }

  public parseTransaction(lines: string[]): Transaction {

    return {
      validTo: new Date(lines[5].slice(8)),
      transLine: lines[0],
      dataLine1: lines[1],
      dataLine2: lines[2],
      feeLine: lines[3],
      idLine: lines[4],
      validToLine: lines[5],
    };
  }

  public createBlock(timestamp: Date, nonce: number, fee: number, difficulty: number, transactions: Transaction[]): string {
    const feeString: string = Number.isInteger(fee) ? `${fee}.0` : fee.toString();

    let str = `--- !Block
Timestamp: ${timestamp.toISOString()}
Difficulty: ${difficulty}
Nonce: ${nonce}
Miner: Kany
Transactions:
  - !Transaction
    Fee: ${feeString}
`;

    const NEW_LINE_WITH_DOUBLE_TAB: string = NL.concat(TAB, TAB);

    for (const transaction of transactions) {
      str = str.concat(
        `  - !Transaction`,
        NEW_LINE_WITH_DOUBLE_TAB,
        transaction.idLine,
        NEW_LINE_WITH_DOUBLE_TAB,
        transaction.feeLine,
        NEW_LINE_WITH_DOUBLE_TAB,
        transaction.dataLine1,
        NEW_LINE_WITH_DOUBLE_TAB,
        transaction.dataLine2,
        NL,
      );
    }

    return str;
  }

  public createDigestBlock(digest: string): string {

    return `--- !Hash
Digest: '${digest}'`;
  }
}
