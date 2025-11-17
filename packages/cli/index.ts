#!/usr/bin/env node
import { Command } from 'commander';
import { chaos, generateModels, inspectResolvers, createSuperGraph, generateResolvers } from '@aexol/axolotl-core';
import { createApp } from './create/index.js';
import { watch } from 'chokidar';
import chalk from 'chalk';
import { existsSync, mkdir, readFileSync, writeFile, writeFileSync } from 'node:fs';
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
    const resolversPath = options.resolvers || './lib/resolvers.js';

    const unImplemented = await inspectResolvers(resolversPath, schemaPath);

    if (unImplemented.length === 0) {
      console.log(chalk.greenBright('✓ All @resolver directive fields are implemented!'));
      process.exit(0);
    }

    console.log(chalk.bold(chalk.yellowBright('Resolvers that need implementation:\n')));

    unImplemented.forEach(([type, field, status]) => {
      const statusIcon = status === 'missing' ? '❌' : '⚠️';
      const statusText = status === 'missing' ? 'not found' : 'throws "Not implemented"';
      console.log(`${statusIcon} ${chalk.cyan(type)}.${chalk.magenta(field)} - ${chalk.gray(statusText)}`);
    });

    console.log(chalk.white(`\nTotal: ${unImplemented.length} resolver(s) to implement`));

    process.exit(1);
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
const generateResolversForSchema = (schemaPath: string, outputBaseDir: string): void => {
  // Read schema file
  const schemaContent = readFileSync(schemaPath, 'utf-8');

  // Generate resolver files
  const files = generateResolvers(schemaContent);

  if (files.length === 0) {
    console.log(chalk.yellowBright(`  No @resolver directives found in ${schemaPath}`));
    return;
  }

  // Process each generated file
  files.forEach((file) => {
    const fullPath = path.join(outputBaseDir, file.name);
    const shouldWrite = file.replace || !existsSync(fullPath);

    if (shouldWrite) {
      writeFileRecursive(path.dirname(fullPath), path.basename(fullPath), file.content);
      console.log(chalk.greenBright(`  ✓ ${file.replace ? 'Updated' : 'Created'}: ${fullPath}`));
    } else {
      console.log(chalk.gray(`  ⊘ Skipped (exists): ${fullPath}`));
    }
  });
};

program
  .command('resolvers')
  .description('Generate resolver boilerplate files from schema with @resolver directives')
  .action(async () => {
    try {
      // Load axolotl config
      const cfg = await config.get();

      if (!cfg) {
        console.log(chalk.red('Error: No axolotl.json config found'));
        process.exit(1);
      }

      // Check for federation
      if (cfg.federation?.length) {
        console.log(chalk.blueBright('Federation detected - generating resolvers for each schema\n'));

        // Process each federated schema
        cfg.federation.forEach((fed) => {
          if (!existsSync(fed.schema)) {
            console.log(chalk.red(`  Schema not found: ${fed.schema}`));
            return;
          }

          // Extract base directory from models path
          const outputBaseDir = path.dirname(fed.models);

          console.log(chalk.bold(`Processing: ${fed.schema}`));
          generateResolversForSchema(fed.schema, outputBaseDir);
          console.log('');
        });
      } else {
        // Non-federated mode
        const schemaPath = cfg.schema;

        if (!schemaPath || !existsSync(schemaPath)) {
          console.log(chalk.red(`Schema not found: ${schemaPath || 'undefined'}`));
          process.exit(1);
        }

        if (!cfg.models) {
          console.log(chalk.red('Error: models path not defined in axolotl.json'));
          process.exit(1);
        }

        // Extract base directory from models path
        const outputBaseDir = path.dirname(cfg.models);

        console.log(chalk.blueBright('Generating resolvers for schema\n'));
        generateResolversForSchema(schemaPath, outputBaseDir);
      }

      console.log(chalk.greenBright('✓ Resolver generation complete'));
    } catch (error) {
      console.log(chalk.red(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
      process.exit(1);
    }
  });

createApp(program);

program.parse();
