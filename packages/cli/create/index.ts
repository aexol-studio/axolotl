import { execSync } from 'child_process';
import chalk, { Color } from 'chalk';
import { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import { BASE_REPOSITORY, MESSAGE_BRAKE, STARTER_DICT } from './consts.js';
type Message = { message: string; color?: typeof Color };

export const createApp = (program: Command) => {
  Object.keys(STARTER_DICT).forEach((starter) => {
    program
      .command(`create-${starter} [destination] [name]`)
      .description(`${STARTER_DICT[starter as keyof typeof STARTER_DICT].description}`)
      .action((_destination, _name) => {
        const destination = (_destination || './') as string;
        const name = (_name || STARTER_DICT[starter as keyof typeof STARTER_DICT].repo) as string;
        const path = correctPath(destination, name);

        const installationMessages: Message[] = [
          { message: `Installing starter GraphQL Server - ${toUpperCase(starter)}...` },
          { message: `This may take a while...`, color: 'yellow' as const },
        ];

        log(installationMessages);
        if (invokeCommands(path, starter, _name !== undefined)) {
          const successMessages: Message[] = [
            { message: `Starter ${starter} created.` },
            { message: `To run it, type:` },
            {
              message: `cd ${chalk.yellow(
                `${STARTER_DICT[starter as keyof typeof STARTER_DICT].repo}`,
              )} && ${chalk.yellow(`npm run start`)}`,
            },
          ];

          log(successMessages);
        } else {
          const errorMessages: Message[] = [
            { message: `Starter ${starter} failed.`, color: 'red' as const },
            { message: `Please try again.`, color: 'red' as const },
          ];

          log(errorMessages);
        }
      });
  });
};

function toUpperCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function invokeCommands(path: string, example: string, different: boolean) {
  try {
    const commands = [
      `git clone -n --depth=1 --filter=tree:0 ${BASE_REPOSITORY} ${path}`,
      `cd ${path} && git sparse-checkout set --include=examples/${example} && git checkout`,
    ];
    commands.forEach((command) => !runCommand(command) && process.exit(1));

    //NOT SURE ABOUT THIS PART
    const json = JSON.parse(fs.readFileSync(`${path}/package.json`, 'utf8'));
    const modifiedJson = {
      ...json,
      name: different ? path.split('/').pop() : json.name,
    };
    const updated = JSON.stringify(modifiedJson, null, 2);
    if (updated !== json) fs.writeFileSync(`${path}/package.json`, updated, 'utf8');
    //NOT SURE ABOUT THIS PART

    if (!runCommand(`cd ${path} && npm install`)) process.exit(1);
    return true;
  } catch (error) {
    return false;
  }
}

function correctPath(destination: string, name: string): string {
  destination = destination.replace(/\/+$/, '');
  if (!destination.startsWith('./')) destination = `./${destination}`;
  return path.posix.join(destination, name);
}

function log(messages: Message[]) {
  console.log(chalk.yellow(MESSAGE_BRAKE));
  messages.forEach((message) => console.log(chalk[message.color || 'green'](message.message)));
  console.log(chalk.yellow(MESSAGE_BRAKE));
}

function runCommand(command: string) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (e) {
    log([{ message: `Command ${command} failed.` }, { message: `Please try again.` }]);
    return false;
  }
  return true;
}
