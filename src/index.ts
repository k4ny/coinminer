import * as WebSocket from 'ws';
import { serverHost, serverPort } from './config';
import { NL } from './consts';
import { createClasses, getZeroCountFromStart, hashingFunction } from './functions';
import { Transactions } from './Transactions';
import { State } from './types';
import { YamlParser } from './YamlParser';

function generateNewBlockAndHash(state: State, transactions: Transactions): Promise<[string, Buffer]> {
  return new Promise((res) => {
    const previousBlock = YamlParser.CREATE_DIGEST_BLOCK(state.Digest);
    // tslint:disable-next-line:insecure-random
    const nonce = Math.ceil(Math.random() * (Number.MAX_SAFE_INTEGER - 1) + 1);
    const block = YamlParser.CREATE_BLOCK(new Date(), nonce, state.Fee, state.Difficulty, transactions);
    const newBlockChain = previousBlock.concat(NL, block);

    // non blocking resolve - important for immediate processing websocket events
    setImmediate(() => {
      res([newBlockChain, hashingFunction(newBlockChain)]);
    });
  });
}

const start = async (): Promise<void> => {

  const { client, logger } = createClasses();

  // tslint:disable-next-line:prefer-const
  let [state, rawTransactions]: [State, any] = await Promise.all([client.getState(), client.getTransactions()]);

  const transactions = new Transactions(YamlParser.PARSE_TRANSACTIONS(rawTransactions));

  try {
    const port = serverPort ? `:${serverPort}` : ``;
    const ws = new WebSocket(`${serverHost}${port}/api/coingame/ws`);

    ws.on('open', () => {
      logger.info('⛓️ websocket opened ⛓️');
    });

    ws.on('message', async (ev: string) => {
      // tslint:disable-next-line:no-reserved-keywords
      const json: { type: string; body: string } = JSON.parse(ev);
      const transaction = YamlParser.PARSE_TRANSACTION(json.body.split(NL));
      if (json.type === 'transaction.removed') {
        transactions.deleteTransaction(transaction);
      }
      if (json.type === 'transaction.added') {
        transactions.addTransaction(transaction);
      }

      // try to check if Digest changed
      const newState = await client.getState();
      if (newState.Digest !== state.Digest) {
        state = newState;
      }

    });
  } catch (err) {
    logger.error(err);
  }

  // tslint:disable-next-line:no-constant-condition
  while (true) {
    const loopPromise: Promise<void> = new Promise(async (resolve) => {

      let hash: Buffer;
      let newBlock: string;

      do {
        [newBlock, hash] = await generateNewBlockAndHash(state, transactions);
      }
      while (getZeroCountFromStart(hash) < state.Difficulty);

      try {
        await client.putBlock(newBlock);
        logger.info('💰 block successfully sent 💰');
      }
      catch (err) {
        logger.error(err.response.data);
        logger.info('🐌 another miner was faster 🐌');
      }
      finally {
        state = await client.getState();
        resolve();
      }
    });

    await loopPromise;
  }
};

void start();
