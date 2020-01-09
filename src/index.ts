//import * as winston from 'winston';
import * as axios from 'axios';
import * as crypto from 'crypto-js';
import { serverUrl } from './config/develop';
import { YamlParser } from './yamlParser';

export interface BlockChain {
  Digest: string;
  TimeStamp: Date;
  Difficulty: number;
  Miner: string;
  Transactions: any;
}

export interface State {
  Digest: string;
  Difficulty: number;
  Fee: number;
}

export class ServerClient {
  private serverUrl;
  private urlPrefix = 'api/coingame';

  public constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  public async getBlockChain(): Promise<BlockChain> {
    const blockchain = await axios.default.get(`${this.serverUrl}${this.urlPrefix}`);

    return (blockchain.data);
  }

  public async getState(): Promise<State> {
    const state = await axios.default.get(`${this.serverUrl}${this.urlPrefix}/state`);

    return (state.data);
  }

  public async getActuals(): Promise<any> {
    const state = await axios.default.get(`${this.serverUrl}${this.urlPrefix}/actuals`);

    return (state.data);
  }

  public async getTransactions(): Promise<any> {
    const transactions = await axios.default.get(`${this.serverUrl}${this.urlPrefix}/txpool`);

    return transactions.data;
  }

  public async putBlock(block: string): Promise<any> {
    return axios.default.put(`${this.serverUrl}${this.urlPrefix}`, block);

  }

}

const start = async (): Promise<void> => {

  const client = new ServerClient(serverUrl);
  const parser = new YamlParser();

  // const logger = winston.createLogger({
  //   level: 'info',
  //   format: winston.format.json(),
  //   defaultMeta: { service: 'user-service' },
  //   transports: [
  //     new winston.transports.Console()
  //   ]
  // });

  //console.log((await client.getBlockChain()));
  const state = await client.getState();
  //console.log(state);
  const transactions = await client.getTransactions();
  //console.log(transactions);

  const parsedTransactions = parser.parseTransactions(transactions);

  const digest = parser.createDigestBlock(state.Digest);
  console.log(digest);

  let hash;
  let nonce;
  let block;
  console.log(state.Difficulty);

  do {
    nonce = Math.ceil(Math.random() * (1000000000000000 - 1) + 1);

    block = parser.createBlock(
      new Date(),
      nonce,
      state.Fee.toString(),
      state.Difficulty,
      [
        parsedTransactions[0],
        parsedTransactions[1],
        parsedTransactions[2],
        parsedTransactions[3],
        parsedTransactions[4],
        parsedTransactions[5],
        parsedTransactions[6],
      ],
    );

    hash = crypto.SHA384(digest.concat(block, digest, block));

  }
  // tslint:disable-next-line: no-suspicious-comment
  //FIXME: difficulty neni pocet nul ve stringu, ale v binarni reprezentaci
  while (hash.toString().slice(0, 3) !== '000');

  console.log(hash);
  console.log(hash.toString());
  console.log(nonce);

  const newBlock = parser.createDigestBlock(hash.toString()).concat(block);
  console.log(newBlock);

  try {
    const result = await client.putBlock(newBlock);
    console.log(result);
  }
  catch (err) {
    console.log(err);
  }

};

void start();
