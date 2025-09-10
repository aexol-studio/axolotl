/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from 'fs';
import { AxolotlAdapter } from '@aexol/axolotl-core';
import { GraphQLSchemaWithContext, YogaInitialContext, createSchema, createYoga } from 'graphql-yoga';
import { createServer } from 'http';
import * as path from 'path';
import { getDirective as getDirectiveFn, mapSchema } from '@graphql-tools/utils';

export type SchemaMapperInitial = Required<Parameters<typeof mapSchema>>[1];
export type SchemaMapper = (
  schema: GraphQLSchemaWithContext<YogaInitialContext>,
  getDirective: typeof getDirectiveFn,
) => SchemaMapperInitial;

export const graphqlYogaWithContextAdapter = <
  Ctx extends Record<string, any>,
  Context = YogaInitialContext & Omit<Ctx, keyof YogaInitialContext>,
>(
  customContext?: Ctx,
) =>
  AxolotlAdapter<[any, any, Context], SchemaMapper>()(
    (
      { resolvers, directives, scalars },
      options?: {
        yoga?: Parameters<typeof createYoga>[0];
        schema?: {
          options?: Parameters<typeof createYoga>[0]['schema'];
          file?: { path: string } | { content: string };
        };
        // Optional per-request context builder to support things like DataLoaders
        context?: (initial: YogaInitialContext) => Promise<Record<string, any>> | Record<string, any>;
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
                  (_: any, args: any, context: any) => {
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

      let yogaSchema = createSchema({
        ...options?.schema?.options,
        typeDefs: schema,
        resolvers: {
          ...yogaResolvers,
          ...scalars,
        },
      });

      if (directives) {
        Object.values(directives).forEach((b) => {
          yogaSchema = mapSchema(yogaSchema, b(yogaSchema, getDirectiveFn));
        });
      }

      const yoga = createYoga({
        ...options?.yoga,
        schema: yogaSchema,
        // Build a fresh context per request so users can attach DataLoaders, request-scoped caches, etc.
        context: async (initial) => {
          const extra = options?.context ? await options.context(initial) : {};
          // Merge order: initial (from Yoga) <- customContext (static) <- extra (dynamic)
          return {
            ...initial,
            ...(customContext || {}),
            ...extra,
          } as Context;
        },
      });

      const server = createServer(yoga);
      return { server, yoga };
    },
  );

export const graphqlYogaAdapter = graphqlYogaWithContextAdapter({});
