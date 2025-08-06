/* eslint-disable @typescript-eslint/no-explicit-any */
import * as ts from 'typescript';
import * as path from 'path';
import { promises as fs } from 'fs';
import chalk from 'chalk';
import { Command } from 'commander';

const TSCONFIG_FILENAME = 'tsconfig.json';
const OUTPUT_FILENAME = 'axolotl.txt';

export const caiContextCommand = (program: Command) => {
  program
    .command('cai-context')
    .description(`${chalk.greenBright('Axolotl ai')} - webhooks creator`)
    .action(main);
};

// Helper: Get entry points (tries 'files', then falls back to all parsed fileNames)
function getEntryPoints(parsedConfig: ts.ParsedCommandLine): string[] {
  if (Array.isArray(parsedConfig.fileNames) && parsedConfig.fileNames.length > 0) {
    return parsedConfig.fileNames.filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'));
  }
  // Fallback: try 'src/index.ts'
  return [path.resolve(process.cwd(), 'src/index.ts')];
}

async function main() {
  const projectDir = process.cwd();
  const tsconfigPath = path.join(projectDir, TSCONFIG_FILENAME);
  console.log(`Reading file at: ${tsconfigPath}`);
  // --- Use robust tsconfig parsing (works with all current/future TypeScript) ---
  const readResult = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
  if (readResult.error) {
    throw new Error(
      ts.formatDiagnosticsWithColorAndContext([readResult.error], {
        getCanonicalFileName: (f) => f,
        getCurrentDirectory: process.cwd,
        getNewLine: () => '\n',
      }),
    );
  }

  const parsedConfig = ts.parseJsonConfigFileContent(readResult.config, ts.sys, path.dirname(tsconfigPath));

  const entryPoints = getEntryPoints(parsedConfig);

  // --- Follow imports recursively from the entry points ---
  const visited = new Set<string>();
  const queue = [...entryPoints];

  while (queue.length > 0) {
    const file = queue.pop()!;
    const realPath = await fs.realpath(file).catch(() => '');
    if (!realPath || visited.has(realPath)) continue;
    visited.add(realPath);

    // Read file content
    const content = await fs.readFile(realPath, 'utf-8').catch(() => '');
    if (!content) continue;

    // Parse, find imports
    const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
    sourceFile.forEachChild((node) => {
      if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
        const moduleSpec = (node.moduleSpecifier as ts.StringLiteral)?.text;
        if (moduleSpec && !moduleSpec.startsWith('.') && !moduleSpec.startsWith('/')) {
          // Probably a node_module or aliased import, skip
          return;
        }
        if (moduleSpec) {
          // Try to resolve module
          const importedFile = ts.resolveModuleName(moduleSpec, file, parsedConfig.options, ts.sys).resolvedModule
            ?.resolvedFileName;
          if (
            importedFile &&
            (importedFile.endsWith('.ts') || importedFile.endsWith('.tsx')) &&
            !importedFile.includes('node_modules') &&
            !importedFile.endsWith('.d.ts')
          ) {
            queue.push(importedFile);
          }
        }
      }
    });
  }

  // --- Concatenate all found files ---
  const parts: string[] = [];
  for (const file of visited) {
    const relPath = path.relative(projectDir, file);
    const content = await fs.readFile(file, 'utf-8').catch(() => '');
    if (!content) continue;
    parts.push(`// ==== File: ${relPath} ====\n${content}\n`);
  }
  const allCode = parts.join('\n');
  await fs.writeFile(OUTPUT_FILENAME, allCode, 'utf-8');
  console.log(`Wrote ${visited.size} files (entry = ${entryPoints.join(', ')}) to "${OUTPUT_FILENAME}"`);
}
