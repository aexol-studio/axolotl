/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from 'fs';
import { AxolotlAdapter } from '@aexol/axolotl-core';
import { YogaInitialContext, createSchema, createYoga } from 'graphql-yoga';
import { createServer } from 'http';
import * as path from 'path';

export const graphqlYogaAdapter = AxolotlAdapter<[any, any, YogaInitialContext]>()((resolvers) => {
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
    schema: createSchema({
      typeDefs: schemaFile,
      resolvers: yogaResolvers,
    }),
  });
  const server = createServer(yoga);
  return server;
});
