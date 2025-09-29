/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxolotlAdapter } from 'npm:@aexol/axolotl-core@^0.9.8';
import type { GraphQLSchemaWithContext, YogaInitialContext } from 'npm:graphql-yoga@^5.4.0';
import { createSchema, createYoga } from 'npm:graphql-yoga@^5.4.0';
import * as path from 'node:path';
import { getDirective as getDirectiveFn, mapSchema } from 'npm:@graphql-tools/utils@10.5.4';
import { createServer } from 'node:http';

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
          : Deno.readTextFileSync(path.join(Deno.cwd(), file?.path || './schema.graphql'));

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
