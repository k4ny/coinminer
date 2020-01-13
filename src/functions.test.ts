import { getZeroCountFromStart, hashingFunction } from './functions';

describe('tests for hash function', () => {
  it('should test the hashing function', async () => {
    const result = hashingFunction(`block`);

    expect(result.toString('hex'))
      .toEqual('96c158f18e0554bfeddbff7feac3c2eb4ef24706c36f09496cc8a53fca050adaad5848c38c8d7b56e7725899b9e8bf1c');
  });
});

describe('tests fro getZeroCountFromStart function', () => {

  it('should return 0 zeros', async () => {
    const buffer = Buffer.from([255]);
    expect(getZeroCountFromStart(buffer))
      .toEqual(0);
  });

  it('should return 0 zeros', async () => {
    const buffer = Buffer.from([128]);
    expect(getZeroCountFromStart(buffer))
      .toEqual(0);
  });

  it('should return 0 zeros', async () => {
    const buffer = Buffer.from('f', 'hex');
    expect(getZeroCountFromStart(buffer))
      .toEqual(0);
  });

  it('should return 1 zeros', async () => {
    const buffer = Buffer.from([127]);
    expect(getZeroCountFromStart(buffer))
      .toEqual(1);
  });

  it('should return 2 zeros', async () => {
    const buffer = Buffer.from([63]);
    expect(getZeroCountFromStart(buffer))
      .toEqual(2);
  });

  it('should return 3 zeros', async () => {
    const buffer = Buffer.from([31]);
    expect(getZeroCountFromStart(buffer))
      .toEqual(3);
  });

  it('should return 4 zeros', async () => {
    const buffer = Buffer.from([15]);
    expect(getZeroCountFromStart(buffer))
      .toEqual(4);
  });

  it('should return 5 zeros', async () => {
    const buffer = Buffer.from([7]);
    expect(getZeroCountFromStart(buffer))
      .toEqual(5);
  });

  it('should return 6 zeros', async () => {
    const buffer = Buffer.from([3]);
    expect(getZeroCountFromStart(buffer))
      .toEqual(6);
  });

  it('should return 7 zeros', async () => {
    const buffer = Buffer.from([1]);
    expect(getZeroCountFromStart(buffer))
      .toEqual(7);
  });

  it('should return 8 zeros', async () => {
    const buffer = Buffer.from([0]);
    expect(getZeroCountFromStart(buffer))
      .toEqual(8);
  });

  it('should return 9 zeros', async () => {
    const buffer = Buffer.from([0, 127]);
    expect(getZeroCountFromStart(buffer))
      .toEqual(9);
  });

  it('should return 16 zeros', async () => {
    const buffer = Buffer.from([0, 0]);
    expect(getZeroCountFromStart(buffer))
      .toEqual(16);
  });
});
