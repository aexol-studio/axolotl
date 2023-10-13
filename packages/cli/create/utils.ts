import chalk, { Color } from 'chalk';
import { MESSAGE_BRAKE } from './consts.js';

type Message = { message: string; color?: typeof Color };

export function toUpperCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function correctPath(destination: string, name: string): string {
  if (destination.startsWith('/')) destination = destination.slice(1);
  if (!destination.startsWith('./')) destination = `./${destination}`;
  return destination === './' ? `${destination}${name}` : `${destination}/${name}`;
}

export function log(messages: Message[]) {
  console.log(chalk.yellow(MESSAGE_BRAKE));
  console.log(`\n`);
  messages.forEach((message) => console.log(chalk[message.color || 'green'](message.message)));
  console.log(`\n`);
  console.log(chalk.yellow(MESSAGE_BRAKE));
}

export function isPathValid(path: string): boolean {
  return /^(\/?[A-Za-z0-9_-]+)+$/.test(path);
}
