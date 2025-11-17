/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResolversUnknown } from '@/types';
import { Parser, TypeDefinition, ParserField } from 'graphql-js-tree';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';

const hasResolverDirective = (field: ParserField): boolean => {
  return field.directives?.some((d) => d.name === 'resolver') || false;
};

export const inspectResolvers = async (resolversPath: string, schemaPath = './schema.graphql') => {
  const absoluteResolversPath = path.isAbsolute(resolversPath)
    ? resolversPath
    : path.join(process.cwd(), resolversPath);
  const absoluteSchemaPath = path.isAbsolute(schemaPath) ? schemaPath : path.join(process.cwd(), schemaPath);

  const resolvers = (await import(absoluteResolversPath)).default as ResolversUnknown<any>;
  const fileContent = readFileSync(absoluteSchemaPath, 'utf8');
  const { nodes } = Parser.parse(fileContent);

  const types = nodes.filter((n) => n.data.type === TypeDefinition.ObjectTypeDefinition);

  const unImplemented = types.flatMap((t) =>
    t.args
      .filter(hasResolverDirective) // Only check @resolver fields
      .map((a) => {
        const resolver = resolvers[t.name]?.[a.name];

        // Check if resolver doesn't exist
        if (!resolver) {
          return [t.name, a.name, 'missing'] as const;
        }

        // Check if function body contains "Not implemented"
        const fnString = resolver.toString();
        if (fnString.includes('Not implemented')) {
          return [t.name, a.name, 'stub'] as const;
        }

        return undefined;
      })
      .filter(<T>(a: T | undefined): a is T => !!a),
  );

  return unImplemented;
};
