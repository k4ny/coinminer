import { yamlTransactionsExample } from './mocks/yamlTransactionsExample';
import { Transactions } from './Transactions';
import { Transaction } from './types';
import { YamlParser } from './YamlParser';

describe('YamlParser tests', () => {

  it('should parse transactions', async () => {
    const resultMap = YamlParser.PARSE_TRANSACTIONS(yamlTransactionsExample);

    const result: Transaction[] = [];

    for (const t of resultMap) {
      result.push(t[1]);
    }

    expect(result[0].transLine)
      .toEqual('--- !Transaction');
    expect(result[0].dataLine1)
      .toEqual(
        `Data: !!binary |`);

    expect(result[0].dataLine2)
      .toEqual(`  QW1vdW50OiAxMy4zCkZyb206IEoyV1FPSkdRREFNVApUbzogNVNHMlVHRDVJSldECg==`);

    expect(result[0].feeLine)
      .toEqual('Fee: 0.1');

    expect(result[0].idLine)
      .toEqual('Id: 326994309364519011938962984663177691490');

    expect(result[0].validToLine)
      .toEqual('ValidTo: 2020-01-09 12:18:10.476251');

    expect(result[0].validTo)
      .toEqual(new Date('2020-01-09T11:18:10.476Z'));

    expect(result[0].transactionForBlock)
      .toEqual(`  - !Transaction
    Id: 326994309364519011938962984663177691490
    Fee: 0.1
    Data: !!binary |
      QW1vdW50OiAxMy4zCkZyb206IEoyV1FPSkdRREFNVApUbzogNVNHMlVHRDVJSldECg==
`);

    expect(result[1].validTo)
      .toEqual(new Date('2020-01-09 12:18:10.478466'));

    expect(result.length)
      .toEqual(100);

    expect(result[99].validTo)
      .toEqual(new Date('2020-01-09 12:19:09.851466'));

  });

  it('should create block', async () => {
    const date = new Date('2020-01-09 12:19:09.851466');
    const transactions = new Transactions(YamlParser.PARSE_TRANSACTIONS(yamlTransactionsExample));

    const result = YamlParser.CREATE_BLOCK(
      date,
      1,
      // tslint:disable-next-line:number-literal-format
      1.0,
      8,
      transactions,
    );

    expect(result)
      .toContain(
        `--- !Block
Timestamp: 2020-01-09T11:19:09.851Z
Difficulty: 8
Nonce: 1
Miner: Kany
Transactions:
  - !Transaction
    Fee: 1.0
  - !Transaction
    Id: 326994309364519011938962984663177691490
    Fee: 0.1
    Data: !!binary |
      QW1vdW50OiAxMy4zCkZyb206IEoyV1FPSkdRREFNVApUbzogNVNHMlVHRDVJSldECg==
  - !Transaction
    Id: 326996098494884909057674548053515895138
    Fee: 0.1
    Data: !!binary |
      QW1vdW50OiAzLjkKRnJvbTogVllWUDE2VDFIRElVClRvOiAwTDI4NDRQMFkzWDYK
`);
  });

  it('should create digest hash part', async () => {
    const result = YamlParser.CREATE_DIGEST_BLOCK('00000000b9d0b0ceeee295cb2c02387d16ecf3b52a0811f165e5902ef78659db96e409b9493ba7fe4433e2439f5672a7');

    expect(result)
      .toEqual(
        `--- !Hash
Digest: '00000000b9d0b0ceeee295cb2c02387d16ecf3b52a0811f165e5902ef78659db96e409b9493ba7fe4433e2439f5672a7'`);
  });
});
