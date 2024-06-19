import { Command } from 'commander';
import chalk from 'chalk';

import { STARTER_DICT, STARTERS } from './consts.js';
import { createAppAction, createDockerFile } from './utils.js';

export const createApp = (program: Command) => {
  program
    .command('create-dockerfile')
    .description(`${chalk.magenta('Axolotl Starter')} - docker files creator`)
    .action(createDockerFile);
  Object.entries(STARTER_DICT).forEach(([key, { description: _description, repo, example, isDeno }]) => {
    const starter = key as STARTERS;
    const command = `create-${starter} [dir]`;
    const description = `${chalk.magenta('Axolotl Starter')} - ${_description}`;
    program
      .command(command)
      .description(description)
      .action((destination) => createAppAction({ starter, repo, example, destination, isDeno }))
      .on('--help', () => {
        console.log('');
        console.log(
          `  ${chalk.magenta(
            '[dir?: string]',
          )} - optional argument, if not provided, starter will be created in ${chalk.red('generated')} directory`,
        );
        console.log('');
        console.log(chalk.gray(`New project in ${chalk.red('generated')} directory`));
        console.log(`$ axolotl create-${starter}`);
        console.log('');
        console.log(chalk.gray(`New project in ${chalk.magenta('passed')} destination`));
        console.log(`$ axolotl create-${starter} test/my-graphql-server`);
        console.log('');
      });
  });
};
