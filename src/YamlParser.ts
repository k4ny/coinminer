import { minerName } from './config';
import { NL, TAB } from './consts';
import { Transactions } from './Transactions';
import { Transaction } from './types';

// tslint:disable-next-line:completed-docs
export class YamlParser {

  public static PARSE_TRANSACTIONS(yaml: string): Map<string, Transaction> {
    const lines = yaml.split(NL);
    const transactions: Map<string, Transaction> = new Map();

    for (let i = 0; i <= lines.length - 6; i = i + 6) {
      const transaction = this.PARSE_TRANSACTION(lines.slice(i, i + 6));
      transactions.set(transaction.idLine, transaction);
    }

    return transactions;
  }

  public static PARSE_TRANSACTION(lines: string[]): Transaction {

    const NEW_LINE_WITH_DOUBLE_TAB: string = NL.concat(TAB, TAB);

    return {
      validTo: new Date(lines[5].slice(8)),
      transLine: lines[0],
      dataLine1: lines[1],
      dataLine2: lines[2],
      feeLine: lines[3],
      idLine: lines[4],
      validToLine: lines[5],
      transactionForBlock: `  - !Transaction`.concat(
        NEW_LINE_WITH_DOUBLE_TAB,
        lines[4],
        NEW_LINE_WITH_DOUBLE_TAB,
        lines[3],
        NEW_LINE_WITH_DOUBLE_TAB,
        lines[1],
        NEW_LINE_WITH_DOUBLE_TAB,
        lines[2],
        NL,
      ),
    };
  }

  public static CREATE_BLOCK(
    timestamp: Date,
    nonce: number,
    fee: number,
    difficulty: number,
    transactions: Transactions,
  ): string {
    const feeString: string = Number.isInteger(fee) ? `${fee}.0` : fee.toString();

    let str = `--- !Block
Timestamp: ${timestamp.toISOString()}
Difficulty: ${difficulty}
Nonce: ${nonce}
Miner: ${minerName}
Transactions:
  - !Transaction
    Fee: ${feeString}
`;

    str = str.concat(transactions.getTransactionsBlock());

    return str;
  }

  public static CREATE_DIGEST_BLOCK(digest: string): string {

    return `--- !Hash
Digest: '${digest}'`;
  }
}
