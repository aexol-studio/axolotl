import { Command } from 'commander';
import chalk from 'chalk';

import { STARTER_DICT, STARTERS } from './consts.js';
import { createAppAction } from './utils.js';

export const createApp = (program: Command) => {
  Object.entries(STARTER_DICT).forEach(([key, { description: _description, repo, example }]) => {
    const starter = key as STARTERS;
    const command = `create-${starter} [dir] [name]`;
    const description = `${chalk.magenta('Axolotl Starter')} - ${_description}`;

    program
      .command(command)
      .description(description)
      .action((destination, name) => createAppAction({ starter, repo, example, destination, name }))
      .on('--help', () => {
        console.log('');
        console.log(`  Examples:`);
        console.log('');
        console.log(
          `  First argument is the ${chalk.red('destination')} folder, second argument is the project ${chalk.red(
            'name',
          )}.`,
        );
        console.log('');
        console.log(
          `    $ axolotl create-${starter} my-graphql-server - ${chalk.gray('New project in specific destination')}`,
        );
        console.log(
          `    $ axolotl create-${starter} my-graphql-server my-server - ${chalk.gray(
            'New project with specific destination and name',
          )}`,
        );
        console.log('');
      });
  });
};
