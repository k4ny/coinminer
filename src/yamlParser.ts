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
  private readonly nl: string = `\n`;
  private readonly tab: string = `  `;

  public parseTransactions(yaml: string): Transaction[] {
    const lines = yaml.split(this.nl);

    const transactions: Transaction[] = [];

    // tslint:disable-next-line:no-suspicious-comment
    //TODO: potencial pro paralelizaci
    for (let i = 0; i < lines.length; i = i + 6) {

      if (lines[i].includes('--- !Transaction')) {

        const transaction: Transaction = {
          validTo: new Date(lines[i + 5].slice(8)),
          transLine: lines[i],
          dataLine1: lines[i + 1],
          dataLine2: lines[i + 2],
          feeLine: lines[i + 3],
          idLine: lines[i + 4],
          validToLine: lines[i + 5],
        };

        transactions.push(transaction);
      }
    }

    return transactions;
  }

  public createBlock(timestamp: Date, nonce: number, fee: string, difficulty: number, transactions: Transaction[]): string {
    let str = `--- !Block
Timestamp: ${timestamp.toISOString()}
Difficulty: ${difficulty}
Nonce: ${nonce}
Miner: Kany
Transactions:
  - !Transaction
    Fee: ${fee}
`;

    for (const transaction of transactions) {
      str = str.concat(
        `  - !Transaction`,
        this.nl,
        this.tab,
        this.tab,
        transaction.idLine,
        this.nl,
        this.tab,
        this.tab,
        transaction.feeLine,
        this.nl,
        this.tab,
        this.tab,
        transaction.dataLine1,
        this.nl,
        this.tab,
        this.tab,
        transaction.dataLine2,
        this.nl,
      );
    }

    return str;
  }

  public createDigestBlock(digest: string): string {

    return `--- !Hash
Digest: '${digest}'`;
  }
}
