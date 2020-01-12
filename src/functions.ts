import * as crypto from 'crypto';
import * as winston from 'winston';
import { serverHost, serverPort } from './config';
import { ServerClient } from './ServerClient';

export function hashingFunction(block: string): Buffer {
  const hashSha384 = crypto.createHash('sha384');
  hashSha384.update(block);
  hashSha384.update(block);

  return hashSha384.digest();
}

export function getZeroCountFromStart(hash: Buffer): number {
  let zeroCount = 0;

  const byteValues: number[] = [128, 64, 32, 16, 8, 4 , 2 , 1];

  for (const byte of hash) {
    for (const byteValue of byteValues) {
      // tslint:disable-next-line:no-bitwise
      if ((byte & byteValue) === 0) {
        zeroCount = zeroCount + 1;
      }
      else {
        return zeroCount;
      }
    }
  }

  return zeroCount;
}

export function createClasses() {
  const client = new ServerClient(serverHost, serverPort);
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
    transports: [
      new winston.transports.Console(),
    ],
  });

  return { client, logger };
}
