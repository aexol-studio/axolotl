#!/usr/bin/env node
import { Command } from 'commander';
import { generateModels } from '@aexol/axolotl-core';
import { createApp } from './create/index.js';

const program = new Command();

program
  .name('axolotl')
  .description('CLI for axolotl backend framework, type-safe, schema-first, development.')
  .version('0.0.0');

program
  .command('init')
  .description('init axolotl framework')
  .action((str, options) => {
    generateModels({
      schemaPath: './schema.graphql',
      modelsPath: './models.ts',
    });
  });

createApp(program);

program.parse();
