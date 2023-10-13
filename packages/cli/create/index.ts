import { execSync } from 'child_process';
import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';

import { BASE_REPOSITORY, STARTER_DICT, STARTERS } from './consts.js';
import { correctPath, isPathValid, log, toUpperCase } from './utils.js';

export const createApp = (program: Command) => {
  Object.entries(STARTER_DICT).forEach(([key, { description, repo, example }]) => {
    const starter = key as STARTERS;
    program
      .command(`create-${starter} [dir] [name]`)
      .description(
        `${chalk.magenta('Axolotl Starter')} - ${description} - directory [dir] and name [name] are optional`,
      )
      .action((_destination, _name) => {
        const destination = (_destination || './') as string;
        const name = (_name || repo) as string;
        const path = correctPath(destination, name);

        const installationMessages = [
          {
            message: `Installing starter ${chalk.magenta('GraphQL Axolotl Server')} - GraphQL ${toUpperCase(
              starter,
            )} example...`,
          },
          { message: `This may take a while...`, color: 'white' as const },
        ];
        log(installationMessages);

        if (invokeCommands(path, example, _name !== undefined)) {
          const successMessages = [
            {
              message: `Starter ${chalk.magenta('GraphQL Axolotl Server')} - GraphQL ${toUpperCase(
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
            { message: `Starter ${starter} failed.`, color: 'red' as const },
            { message: `Please try again.`, color: 'red' as const },
          ];

          log(errorMessages);
        }
      });
  });
};

function invokeCommands(path: string, example: string, different: boolean) {
  try {
    if (!isPathValid(path)) {
      log([{ message: `Path ${path} is not valid.`, color: 'red' as const }]);
      return false;
    }

    const commands = [
      `git clone -n --depth=1 --filter=tree:0 ${BASE_REPOSITORY} ${path}`,
      `cd ${path} && git sparse-checkout set --include=examples/${example} && git checkout`,
    ];
    commands.forEach((command) => !runCommand(command) && process.exit(1));

    // NOT SURE ABOUT THIS PART
    const json = JSON.parse(fs.readFileSync(`${path}/package.json`, 'utf8'));
    const modifiedJson = {
      ...json,
      name: different ? path.split('/').pop() : json.name,
    };
    const updated = JSON.stringify(modifiedJson, null, 2);
    if (updated !== json) fs.writeFileSync(`${path}/package.json`, updated, 'utf8');
    // NOT SURE ABOUT THIS PART

    const install = runCommand(`cd ${path} && npm install`);
    if (!install) process.exit(1);

    return true;
  } catch (error) {
    return false;
  }
}

function runCommand(command: string) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (e) {
    console.error(e);
    log([
      { message: `Command ${command} failed.`, color: 'red' as const },
      { message: `Please try again.`, color: 'white' as const },
    ]);
    return false;
  }
  return true;
}
