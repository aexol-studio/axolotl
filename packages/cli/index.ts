#!/usr/bin/env node
import { Command } from 'commander';
import { chaos, generateModels, inspectResolvers, createSuperGraph } from '@aexol/axolotl-core';
import { createApp } from './create/index.js';
import { watch } from 'chokidar';
import chalk from 'chalk';
import { mkdir, readFileSync, writeFile, writeFileSync } from 'node:fs';
import { config, ProjectOptions } from '@aexol/axolotl-config';
import * as path from 'node:path';
import { TranslateGraphQL, TranslateOptions } from 'graphql-zeus-core';

const program = new Command();

program
  .name('axolotl')
  .description('CLI for axolotl backend framework, type-safe, schema-first, development.')
  .version('0.1.1');

export const writeSchema = (schemaFile: Record<string, string>, pathToFile: string) => {
  Object.keys(schemaFile).forEach((k) =>
    writeFileRecursive(path.join(pathToFile, 'zeus'), `${k}.ts`, schemaFile[k as keyof typeof schemaFile]),
  );
};

export function writeFileRecursive(pathToFile: string, filename: string, data: string): void {
  mkdir(pathToFile, { recursive: true }, () => {
    writeFile(path.join(pathToFile, filename), data, () => {});
  });
}

const generateZeusSchema = (schema: string, generationPath: string, opts?: Partial<TranslateOptions>) => {
  const schemaFile = TranslateGraphQL.typescriptSplit({
    schema,
    env: 'browser',
    ...opts,
  });
  writeSchema(schemaFile, generationPath);
};

const generateFiles = (options: ProjectOptions) => {
  let superGraphSchema = '';
  if (options.federation?.length) {
    options.federation.forEach((f) => {
      generateModels({
        schemaPath: f.schema,
        modelsPath: f.models,
      });
      const generationMessage = `Federation ${f.schema}. Models in path "${f.models}" have been generated.`;
      console.log(chalk.greenBright(generationMessage));
    });
    const federatedSchemas = options.federation.map((f) => readFileSync(f.schema, 'utf-8'));
    superGraphSchema = createSuperGraph(...federatedSchemas);
    writeFileSync(options.schema, superGraphSchema);
    console.log(chalk.greenBright(`Supergraph schema saved in ${options.schema}`));
  }
  generateModels({
    schemaPath: options.schema,
    modelsPath: options.models,
  });
  const generationMessage = `Models in path "${options.models}" have been generated.`;
  console.log(chalk.greenBright(generationMessage));
  superGraphSchema = superGraphSchema || readFileSync(options.schema, 'utf-8');
  if (options.zeus?.length) {
    options.zeus.forEach((z) => {
      generateZeusSchema(z.schema ? readFileSync(z.schema, 'utf-8') : superGraphSchema, z.generationPath, {
        deno: options.deno,
      });
      console.log(chalk.greenBright(`Zeus schema ${z.schema ? z.schema : 'supergraph'} saved in ${z.generationPath}`));
    });
  }
};

program
  .command('build')
  .description('build axolotl models')
  .option('-s, --schema <path>', 'watch schema changes and regenerate models')
  .option('-m, --models <path>', 'path to generated models file')
  .option('-w, --watch', 'watch schema changes and regenerate models')
  .action(async (options) => {
    const cfg = await config.get();
    const isFederated = cfg.federation;
    const schemaPath = await config.getValueOrThrow('schema', {
      ...('schema' in options && { commandLineProvidedOptions: options }),
      saveOnInput: true,
    });
    const modelsPath = await config.getValueOrThrow('models', {
      ...('models' in options && { commandLineProvidedOptions: options }),
      saveOnInput: true,
    });
    const deno = !!cfg.deno;
    generateFiles({
      schema: schemaPath,
      models: modelsPath,
      federation: isFederated,
      zeus: cfg.zeus,
      deno,
    });
    if (options.watch) {
      console.log(chalk.yellowBright(`Watching for "${schemaPath}" file changes to regenerate models`));
      watch(schemaPath, {
        interval: 0, // No delay
        ignoreInitial: true,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }).on('all', async (event, p) => {
        console.log(chalk.blueBright('Schema file changed. I will generate new models'));
        generateFiles({
          schema: schemaPath,
          models: modelsPath,
          federation: isFederated,
          deno,
        });
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
  .option('-d, --depth <number>', 'max selection depth', '2')
  .option('-t, --tests <number>', 'number of queries to execute', '10')
  .option('-m, --mutations', 'include mutations in chaos run')
  .option('-H, --header <header...>', 'optional headers (repeatable, "Key: Value")')
  .option('-v, --verbose', 'print queries and sample errors')
  .option('--seed <number>', 'seed for deterministic chaos runs')
  .option('--fragments <number>', 'max inline fragments per interface/union', '2')
  .action((options) => {
    const headers: Record<string, string> = {};
    const hs: string[] | undefined = options.header;
    if (Array.isArray(hs)) {
      hs.forEach((h) => {
        const idx = h.indexOf(':');
        if (idx !== -1) {
          const k = h.slice(0, idx).trim();
          const v = h.slice(idx + 1).trim();
          if (k) headers[k] = v;
        }
      });
    }
    chaos(options.url, options.schema, {
      maxDepth: Number(options.depth) || 2,
      tests: Number(options.tests) || 10,
      includeMutations: !!options.mutations,
      headers,
      verbose: !!options.verbose,
      seed: options.seed !== undefined ? Number(options.seed) : undefined,
      fragmentsPerType: Number(options.fragments) || 2,
    });
  });
createApp(program);

program.parse();
