import { NL } from './consts';
import { State } from './types';

// tslint:disable-next-line:completed-docs
export class StateHelper {
  private state: State;
  private readonly minerName: string;
  private date: Date;
  private digestBlock: string;
  private blockFirstPart: string;
  private blockSecondPart: string;

  constructor(state: State, minerName: string, date: Date) {
    this.state = state;
    this.minerName = minerName;
    this.date = date;
    this.generateBlocks();
  }

  public setNewState(state: State) {
    if (this.state.Digest !== state.Digest || this.state.Difficulty !== state.Difficulty || this.state.Fee !== state.Difficulty) {
      this.state = state;
      this.date = new Date();
      this.generateBlocks();
    }
  }

  public getFormatedBlock(nonce: number) {
    return this.digestBlock.concat(
      NL,
      this.blockFirstPart,
      `Nonce: ${nonce}`,
      this.blockSecondPart,
    );
  }

  private formatFeeString(): string {
    return Number.isInteger(this.state.Fee)
      ? `${this.state.Fee}.0`
      : this.state.Fee.toString();
  }

  private generateBlocks() {
    this.digestBlock = `--- !Hash
Digest: '${this.state.Digest}'`;

    this.blockFirstPart = `--- !Block
Timestamp: ${this.date.toISOString()}
Difficulty: ${this.state.Difficulty}
`;

    this.blockSecondPart = `
Miner: ${this.minerName}
Transactions:
  - !Transaction
    Fee: ${this.formatFeeString()}
`;
  }
}
