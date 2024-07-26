import { Command } from 'commander';
import chalk from 'chalk';

import { addModuleAction } from './utils.js';
import { MODULES } from '@/add/consts.js';

export const createApp = (program: Command) => {
  const command = `add [module_name]`;
  const description = `add module in src/modules directory to work with federated axolotl - ${chalk.magenta('Modularium')}. Available modules: ${Object.keys(MODULES).join(', ')}`;
  program
    .command(command)
    .description(description)
    .action((moduleKey) => addModuleAction({ moduleKey }));
};
