/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from 'fs';
import { AxolotlAdapter } from '@aexol/axolotl-core';
import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { getDirective as getDirectiveFn, mapSchema } from '@graphql-tools/utils';
import * as path from 'path';
import { GraphQLSchema } from 'graphql';

type SchemaMapperInitial = Required<Parameters<typeof mapSchema>>[1];
export type SchemaMapper = (schema: GraphQLSchema, getDirective: typeof getDirectiveFn) => SchemaMapperInitial;
export const apolloServerAdapter = AxolotlAdapter<[any, any, any, any], SchemaMapper>()((
  { resolvers, directives, scalars },
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

  let apolloSchema = makeExecutableSchema({
    typeDefs: schema,
    resolvers: {
      ...apolloResolvers,
      ...scalars,
    },
  });

  if (directives) {
    Object.values(directives).forEach((b) => {
      apolloSchema = mapSchema(apolloSchema, b(apolloSchema, getDirectiveFn));
    });
  }
  const apolloServer = new ApolloServer({ schema: apolloSchema });

  return apolloServer;
});
