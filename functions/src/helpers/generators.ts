import { randomBytes } from 'node:crypto'

export function emailCodeGenerator(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function oobCodeGenerator(): string {
  let buff: Buffer = randomBytes(64);
  return buff.toString('hex');
}
