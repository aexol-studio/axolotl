/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from 'fs';
import { AxolotlAdapter } from '@aexol/axolotl-core';
import { ApolloServer } from '@apollo/server';

import * as path from 'path';

export const apolloServerAdapter = AxolotlAdapter<[any, any, any, any]>()((
  resolvers,
  options?: {
    schema?: {
      file?: { path: string } | { content: string };
    };
  },
) => {
  const apolloResolvers = Object.fromEntries(
    Object.entries(resolvers).map(([typeName, v]) => {
      return [
        typeName,
        Object.fromEntries(
          Object.entries(v).map(([fieldName, resolver]) => {
            return [
              fieldName,
              (parent: any, args: any, contextValue: any, info: any) => {
                return resolver([parent, args, contextValue, info], args);
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
  const apolloServer = new ApolloServer({
    typeDefs: schema,
    resolvers: apolloResolvers,
  });

  return apolloServer;
});
