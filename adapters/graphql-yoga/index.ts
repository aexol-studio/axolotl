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
type UnwrapValue<T> = T extends (...args: any[]) => infer R ? (R extends Promise<infer PR> ? PR : R) : T;
type ResolveContext<T> = { [K in keyof T]: UnwrapValue<T[K]> };
type ContextDefinition<Ctx> = {
  [K in keyof Ctx]: Ctx[K] | ((initial: YogaInitialContext) => Ctx[K] | Promise<Ctx[K]>);
};

export const graphqlYogaWithContextAdapter = <
  Ctx extends Record<string, any>,
  ResolvedCtx extends Record<string, any> = ResolveContext<Ctx>,
  Context = YogaInitialContext & Omit<ResolvedCtx, keyof YogaInitialContext>,
>(
  customContext?: ContextDefinition<Ctx>,
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
                // Subscription resolvers need special handling
                // Support both object form { subscribe, resolve } and function form
                if (typeName === 'Subscription') {
                  if (typeof resolver === 'object' && resolver !== null && 'subscribe' in resolver) {
                    return [
                      fieldName,
                      {
                        subscribe: (_: any, args: any, context: any) => {
                          return (resolver as any).subscribe([_, args, context], args);
                        },
                        resolve: (resolver as any).resolve || ((payload: any) => payload),
                      },
                    ];
                  }
                  return [
                    fieldName,
                    {
                      subscribe: (_: any, args: any, context: any) => {
                        return (resolver as any)([_, args, context], args);
                      },
                      resolve: (payload: any) => payload,
                    },
                  ];
                }
                return [
                  fieldName,
                  (_: any, args: any, context: any) => {
                    return (resolver as any)([_, args, context], args);
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
          const hydratedCustomContext = Object.entries(customContext || {}).length
            ? Object.fromEntries(
                await Promise.all(
                  Object.entries(customContext || {}).map(async ([key, value]) => {
                    if (typeof value === 'function') {
                      const resolvedValue = await (value as (ctx: YogaInitialContext) => any)(initial);
                      return [key, resolvedValue];
                    }
                    return [key, value];
                  }),
                ),
              )
            : null;
          // Merge order: initial (from Yoga) <- customContext (static) <- extra (dynamic)
          return {
            ...initial,
            ...(hydratedCustomContext || {}),
            ...extra,
          } as Context;
        },
      });

      const server = createServer(yoga);
      return { server, yoga };
    },
  );

export const graphqlYogaAdapter = graphqlYogaWithContextAdapter({});
