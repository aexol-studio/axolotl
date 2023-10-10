import { Command } from 'commander';
import { generateModels } from '@jenot/core';

const program = new Command();

program
  .name('jenot')
  .description('CLI for jenot backend framework, type-safe, schema-first, development.')
  .version('0.0.0');

program
  .command('init')
  .description('init jenot framework')
  .action((str, options) => {
    process.env.GRAAL_DEV = 'development';
    generateModels({
      schemaPath: './schema.graphql',
      modelsPath: './models.ts',
    });
  });

program.parse();
