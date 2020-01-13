import * as axios from 'axios';
import { BlockChain, State } from './types';

// tslint:disable-next-line:completed-docs
export class ServerClient {
  private readonly serverUrl: string;
  private readonly urlPrefix: string = '/api/coingame';

  constructor(serverHost: string, serverPort: string) {
    const port = serverPort ? `:${serverPort}` : ``;
    this.serverUrl = `${serverHost}${port}`;
  }

  public async getBlockChain(): Promise<BlockChain> {
    const blockchain = await axios.default.get(`${this.serverUrl}${this.urlPrefix}`);

    return blockchain.data;
  }

  public async getState(): Promise<State> {
    const state = await axios.default.get(`${this.serverUrl}${this.urlPrefix}/state`);

    return state.data;
  }

  public async getActuals(): Promise<any> {
    const state = await axios.default.get(`${this.serverUrl}${this.urlPrefix}/actuals`);

    return state.data;
  }

  public async getTransactions(): Promise<any> {
    const transactions = await axios.default.get(`${this.serverUrl}${this.urlPrefix}/txpool`);

    return transactions.data;
  }

  public async putBlock(block: string): Promise<any> {
    return axios.default.put(`${this.serverUrl}${this.urlPrefix}`, block, {
      headers: {
        'Content-type': 'text/plain',
      },
    });

  }

}
