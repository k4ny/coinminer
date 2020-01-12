//import * as winston from 'winston';
import * as WebSocket from 'ws';
import { serverHost, serverPort } from './config/config';
import { NL } from './consts';
import { getZeroCountFromStart, hashingFunction } from './functions';
import { ServerClient } from './ServerClient';
import { State } from './types';
import { YamlParser } from './yamlParser';

const start = async (): Promise<void> => {

  const client = new ServerClient(serverHost, serverPort);
  const parser = new YamlParser();

  // const logger = winston.createLogger({
  //   level: 'info',
  //   format: winston.format.json(),
  //   defaultMeta: { service: 'user-service' },
  //   transports: [
  //     new winston.transports.Console()
  //   ]
  // });

  try {
    const ws = new WebSocket(`${serverHost}:${serverPort}/api/coingame/ws`);

    ws.on('open', () => {
      console.log('⛓️ websocket opened ⛓️');
    });

    // tslint:disable-next-line:no-reserved-keywords
    ws.on('message', (ev: string) => {
      // tslint:disable-next-line:no-reserved-keywords
      const json: { type: string; body: string } = JSON.parse(ev);
      if (json.type === 'transaction.removed') {
        const transaction = parser.parseTransaction(json.body.split(NL));
        console.log(`removed ${transaction.idLine}`);
      }
      if (json.type === 'transaction.added') {
        const transaction = parser.parseTransaction(json.body.split(NL));
        console.log(`added ${transaction.idLine}`);
      }
    });
  } catch (err) {
    console.log(err);
  }

  // tslint:disable-next-line:no-constant-condition
  while (true) {
    const loopPromise: Promise<void> = new Promise(async (resolve) => {

      const [state, transactions]: [State, any] = await Promise.all([client.getState(), client.getTransactions()]);

      const parsedTransactions = parser.parseTransactions(transactions);

      const previousBlock = parser.createDigestBlock(state.Digest);

      let hash: Buffer;
      let nonce;
      let newBlock;

      do {

        const blockLoop: Promise<Buffer> = new Promise((res) => {
          // tslint:disable-next-line:insecure-random
          nonce = Math.ceil(Math.random() * (1000000000000000 - 1) + 1);

          const block = parser.createBlock(
            new Date(),
            nonce,
            state.Fee,
            state.Difficulty,
            parsedTransactions.slice(0, 99),
          );

          newBlock = previousBlock
            .concat(NL, block);

          // non blocking resolve - important for immediate processing websocket events
          setImmediate(() => {
            res(hashingFunction(newBlock));
          });

        });

        hash = await blockLoop;

      }
      while (getZeroCountFromStart(hash) < state.Difficulty);

      try {
        const result = await client.putBlock(newBlock);
        console.log(result.data);
        resolve();
      }
      catch (err) {
        console.log(err);
        resolve();
      }
    });

    await loopPromise;
  }

};

void start();
