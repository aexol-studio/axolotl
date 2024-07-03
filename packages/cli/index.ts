#!/usr/bin/env node
import { Command } from 'commander';
import { chaos, generateModels, inspectResolvers } from '@aexol/axolotl-core';
import { createApp } from './create/index.js';
import { watch } from 'chokidar';
import chalk from 'chalk';
import { ConfigMaker } from 'config-maker';
import { createResolversConfig } from './codegen/index.js';
const program = new Command();

program
  .name('axolotl')
  .description('CLI for axolotl backend framework, type-safe, schema-first, development.')
  .version('0.1.1');

type ProjectOptions = {
  schema: string,
  models: string
  }

const config = new ConfigMaker<ProjectOptions, {}>('configuration', {
    decoders: {
      schema:{
        decode: (v: unknown) => v + '',
        encode: (v: unknown) => v + '',
      },
      models:{
        decode: (v: unknown) => v + '',
        encode: (v: unknown) => v + '',
      }
    },
    config:{
      environment: {
        schema: 'SCHEMA_PATH',
        models: 'MODELS_PATH'
      }
    }
  });

program
  .command('build')
  .description('build axolotl models')
  .option('-s, --schema <path>', 'watch schema changes and regenerate models')
  .option('-m, --models <path>', 'path to generated models file')
  .option('-w, --watch', 'watch schema changes and regenerate models')
  .action(async (options) => {
    const schemaPath = await config.getValueOrThrow("schema", {...('schema' in options && {commandLineProvidedOptions: options})})
    const modelsPath = await config.getValueOrThrow("models", {...('models' in options && {commandLineProvidedOptions: options})})
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

createResolversConfig(program);

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
  .action(async (options) => {
    const schemaPath = options.schema || './schema.graphql';
    const resolversPath = options.resolvers || './src/resolvers.ts';
    const unImplemented = await inspectResolvers(resolversPath, schemaPath);
    const unImplementedScalarsBuiltIn = unImplemented.filter((ui) => !!ui[3]);
    const unImplementedTypes = unImplemented.filter((ui) => !ui[3]);
    console.log(chalk.bold(chalk.blue('Unimplemented scalar fields:\n')));
    unImplementedScalarsBuiltIn.forEach(([type, field, compiled]) => {
      console.log(
        `${chalk.magenta(type)}.${chalk.blueBright(field)} of type: ${chalk.magentaBright(
          compiled,
        )} is not implemented inside axolotl resolvers.`,
      );
    });
    console.log(chalk.bold(chalk.magentaBright('\n\nUnimplemented type fields:\n')));
    if (unImplementedTypes.length === 0) {
      console.log(chalk.greenBright('All type fields implemented 🎊'));
    }
    unImplementedTypes.forEach(([type, field, compiled]) => {
      console.log(
        `${chalk.magenta(type)}.${chalk.blueBright(field)} of type: ${chalk.magentaBright(
          compiled,
        )} is not implemented inside axolotl resolvers.`,
      );
    });
    console.log(
      chalk.greenBright(
        `\nFinished checking resolvers. ${chalk.yellow(
          `${unImplementedTypes.length} type resolvers not implemented\n${unImplementedScalarsBuiltIn.length} scalar fields resolvers not implemented`,
        )}. Remember that in GraphQL you don't need to implement resolver for every field.`,
      ),
    );
    process.exit();
  });
program
  .command('chaos')
  .description('Perform chaos testing on GraphQL server')
  .option('-s, --schema <path>', 'schema to compare', './schema.graphql')
  .option('-u, --url <path>', 'url path to the server', 'http://localhost:4000/graphql')
  .action((options) => {
    chaos(options.url, options.schema);
  });
createApp(program);

program.parse();
