//import * as winston from 'winston';
import { serverHost, serverPort } from './config/config';
import { ServerClient } from './ServerClient';
import { YamlParser } from './yamlParser';
import { hashingFunction } from './functions';

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

    hash = hashingFunction(digest, block);

    console.log(hash);

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
