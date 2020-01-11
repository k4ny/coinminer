//import * as winston from 'winston';
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

  const [state, transactions]: [State, any] = await Promise.all([client.getState(), client.getTransactions()]);

  const parsedTransactions = parser.parseTransactions(transactions);

  const previousBlock = parser.createDigestBlock(state.Digest);

  let hash: Buffer;
  let nonce;
  let newBlock;
  console.log(state.Difficulty);

  do {
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

    hash = hashingFunction(newBlock);
  }
  while (getZeroCountFromStart(hash) < state.Difficulty);

  console.log(newBlock);

  try {
    console.log(`'${newBlock}'`);
    const result = await client.putBlock(newBlock);
    console.log(result);
  }
  catch (err) {
    console.log(err);
  }

};

void start();
