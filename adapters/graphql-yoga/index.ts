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
    schema?: {
      options?: Parameters<typeof createYoga>[0]['schema'];
      file?: { path: string } | { content: string };
    };
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
  const file = options?.schema?.file;
  const schema =
    file && 'content' in file
      ? file.content
      : readFileSync(path.join(process.cwd(), file?.path || './schema.graphql'), 'utf-8');

  const yoga = createYoga({
    ...options?.yoga,
    schema: createSchema({
      ...options?.schema?.options,
      typeDefs: schema,
      resolvers: yogaResolvers,
    }),
  });
  const server = createServer(yoga);
  return server;
});
