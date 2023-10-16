import * as path from 'path';
import chalk, { Color } from 'chalk';
import { BASE_REPOSITORY, MESSAGE_BRAKE } from './consts.js';
import fs from 'fs';
import { execSync } from 'child_process';

type Message = { message: string; color?: typeof Color };

export const createAppAction = ({
  starter,
  repo,
  example,
  destination = './',
  name,
}: {
  starter: string;
  repo: string;
  example: string;
  destination: string;
  name?: string;
}) => {
  const _name = name || repo;
  const path = correctPath(destination, _name);
  const installationMessages = [
    {
      message: `Installing starter ${chalk.magenta('GraphQL Axolotl Server')} - GraphQL ${firstLetterToUpperCase(
        starter,
      )} example...`,
    },
    { message: `This may take a while...`, color: 'white' as const },
  ];
  log(installationMessages);
  if (prepareCommands(path, example, _name)) {
    const successMessages = [
      {
        message: `Starter ${chalk.magenta('GraphQL Axolotl Server')} - GraphQL ${firstLetterToUpperCase(
          starter,
        )} example created.`,
      },
      { message: `To run it, type:`, color: 'white' as const },
      {
        message: `cd ${chalk.magenta(`${repo}`)} && ${chalk.magenta(`npm run start`)}`,
        color: 'yellow' as const,
      },
    ];

    log(successMessages);
  } else {
    const errorMessages = [
      { message: `Starter ${chalk.magenta('GraphQL Axolotl Server')} failed.`, color: 'red' as const },
    ];

    log(errorMessages, true);
    process.exit(1);
  }
};

function prepareCommands(path: string, example: string, name?: string): boolean {
  try {
    if (!checkNodeVersion('16.20')) return false;
    if (!isPathValid(path)) return false;

    const commands = [
      `git clone -n --depth=1 --filter=tree:0 ${BASE_REPOSITORY} ${path}`,
      `cd ${path} && git sparse-checkout set --include=examples/${example} && git checkout`,
    ];
    commands.forEach((command) => !runCommand(command) && process.exit(1));

    // NOT SURE ABOUT THIS STEP
    const json = JSON.parse(fs.readFileSync(`${path}/package.json`, 'utf8'));
    const modified = {
      ...json,
      name: name || json.name,
    };
    const updated = JSON.stringify(modified, null, 2);
    if (updated !== JSON.stringify(json, null, 2)) fs.writeFileSync(`${path}/package.json`, updated, 'utf8');
    // NOT SURE ABOUT THIS STEP

    const install = runCommand(`cd ${path} && npm install`);
    if (!install) process.exit(1);

    return true;
  } catch (error) {
    return false;
  }
}

const runCommand = (command: string) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (e) {
    log([
      { message: `Command ${command} failed.`, color: 'red' as const },
      { message: `Please try again.`, color: 'white' as const },
    ]);
    return false;
  }
  return true;
};

const firstLetterToUpperCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const correctPath = (destination: string, name: string) => {
  if (destination.startsWith('/')) destination = destination.slice(1);
  if (!destination.startsWith('./')) destination = `./${destination}`;
  return path.posix.join(destination, name);
};

const log = (messages: Message[], withoutBreak?: boolean) => {
  if (!withoutBreak) {
    console.log(chalk.yellow(MESSAGE_BRAKE));
  } else {
    console.log(`\n`);
  }
  messages.forEach((message) => console.log(chalk[message.color || 'green'](message.message)));

  if (!withoutBreak) {
    console.log(chalk.yellow(MESSAGE_BRAKE));
  } else {
    console.log(`\n`);
  }
};

const isPathValid = (path: string) => {
  const isValid = /^(\/?[A-Za-z0-9_-]+)+$/.test(path);
  const pathErrorMessages = [
    { message: `Path ${path} is not valid.`, color: 'red' as const },
    { message: `Please try again.`, color: 'white' as const },
  ];
  if (!isValid) log(pathErrorMessages);
  return isValid;
};

const checkNodeVersion = (version: string) => {
  const [_major, _minor] = version.split('.');
  const nodeVersion = process.versions.node;
  const [major, minor] = nodeVersion.split('.');

  if (Number(major) < Number(_major) || (Number(major) === Number(_major) && Number(minor) < Number(_minor))) {
    const nodeErrorMessages = [
      { message: `You need Node.js version ${version} or higher to run this app.`, color: 'red' as const },
      { message: `You are currently running Node.js ${nodeVersion}.`, color: 'red' as const },
    ];
    log(nodeErrorMessages);
    return false;
  }
  return true;
};
