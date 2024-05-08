#!/usr/bin/env node
import { Command } from 'commander';
import { generateModels, inspectResolvers } from '@aexol/axolotl-core';
import { createApp } from './create/index.js';
import { watch } from 'chokidar';
import chalk from 'chalk';
const program = new Command();

program
  .name('axolotl')
  .description('CLI for axolotl backend framework, type-safe, schema-first, development.')
  .version('0.1.1');

program
  .command('build')
  .description('build axolotl models')
  .option('-s, --schema <path>', 'watch schema changes and regenerate models', './schema.graphql')
  .option('-m, --models <path>', 'path to generated models file', './models.ts')
  .option('-w, --watch', 'watch schema changes and regenerate models')
  .action((options) => {
    const schemaPath = options.schema || './schema.graphql';
    const modelsPath = options.models || './models.ts';
    generateModels({
      schemaPath,
      modelsPath,
    });
    const generationMessage = `Models in path "${modelsPath}" have been generated.`;
    console.log(chalk.greenBright(generationMessage));
    if (options.watch) {
      console.log(chalk.yellowBright(`Watching for "${schemaPath}" file changes to regenerate models`));
      watch(schemaPath, {
        interval: 0, // No delay
        ignoreInitial: true,
      }).on('all', async (event, p) => {
        console.log(chalk.blueBright('Schema file changed. I will generate new models'));
        generateModels({
          schemaPath,
          modelsPath,
        });
        console.log(chalk.greenBright(generationMessage));
      });
    }
  });
program
  .command('inspect')
  .description('inspect axolotl resolvers')
  .option('-s, --schema <path>', 'schema to compare', './schema.graphql')
  .option(
    '-r, --resolvers <path>',
    `path to file with all resolvers created with createResolvers exported as default - for example ./lib/resolvers.js. Path to the transpiled file. 
Example ./src/resolvers.ts:

import { createResolvers } from '@/src/axolotl.js';

const resolvers = createResolvers({
  Query: {
    hello: () => 'world'
  },
});

export default resolvers

`,
    './lib/resolvers.js',
  )
  .action((options) => {
    const schemaPath = options.schema || './schema.graphql';
    const resolversPath = options.resolvers || './src/resolvers.ts';
    const generationMessage = `finished checking resolvers`;
    inspectResolvers(resolversPath, schemaPath);
    console.log(chalk.greenBright(generationMessage));
  });
createApp(program);

program.parse();
