/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from 'node:fs';
import { AxolotlAdapter } from 'npm:@aexol/axolotl-core@^0.2.7';
import type { YogaInitialContext } from 'npm:graphql-yoga@^5.4.0';
import { createSchema, createYoga } from 'npm:graphql-yoga@^5.4.0';
import * as path from 'node:path';

// deno-lint-ignore no-explicit-any
export default AxolotlAdapter<[any, any, YogaInitialContext]>()((
  resolvers,
  options?: {
    yoga?: Parameters<typeof createYoga>[0];
    schema?: Parameters<typeof createYoga>[0]['schema'];
  },
) => {
  const yogaResolvers = Object.fromEntries(
    Object.entries(resolvers).map(([typeName, v]) => {
      return [
        typeName,
        Object.fromEntries(
          Object.entries(v).map(([fieldName, resolver]) => {
            return [
              fieldName,
              // deno-lint-ignore no-explicit-any
              (_: any, args: any, context: YogaInitialContext) => {
                return resolver([_, args, context], args);
              },
            ];
          }),
        ),
      ];
    }),
  );
  const schemaFile = readFileSync(path.join(Deno.cwd(), './schema.graphql'), 'utf-8');
  const yoga = createYoga({
    ...options?.yoga,
    schema: createSchema({
      ...options?.schema,
      typeDefs: schemaFile,
      resolvers: yogaResolvers,
    }),
  });
  return yoga
});
