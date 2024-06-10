/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from 'fs';
import { AxolotlAdapter } from '@aexol/axolotl-core';
import { YogaInitialContext, createSchema, createYoga } from 'graphql-yoga';
import { createServer } from 'http';
import * as path from 'path';

export const graphqlYogaAdapter = AxolotlAdapter<[any, any, YogaInitialContext]>()((
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
              (_: any, args: any, context: YogaInitialContext) => {
                return resolver([_, args, context], args);
              },
            ];
          }),
        ),
      ];
    }),
  );
  const schemaFile = readFileSync(path.join(process.cwd(), './schema.graphql'), 'utf-8');
  const yoga = createYoga({
    ...options?.yoga,
    schema: createSchema({
      ...options?.schema,
      typeDefs: schemaFile,
      resolvers: yogaResolvers,
    }),
  });
  const server = createServer(yoga);
  return server;
});
