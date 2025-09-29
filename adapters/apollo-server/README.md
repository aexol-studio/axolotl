# @aexol/axolotl-apollo-server

Apollo Server adapter for Axolotl. It wires Axolotl resolvers, scalars and directives into an Apollo Server instance.

## What It Does

- Translates Axolotl resolver signatures to Apollo resolvers
- Loads schema from file/content and builds an executable schema
- Applies GraphQL directives via `@graphql-tools/utils` mapping

## Types Provided

- Resolver input tuple: `[Source, Args, ContextValue, Info]`
- Directive mapper: `SchemaMapper = (schema: GraphQLSchema, getDirective: typeof getDirectiveFn) => SchemaMapperInitial`
- Adapter type: `AxolotlAdapter<[any, any, any, any], SchemaMapper>`
- Return value: `ApolloServer` instance with pre-built schema

## Scalars

- Define scalars with `createScalars` from axolotl-core and pass them to the adapter: `apolloServerAdapter({ resolvers, scalars })`.
- Scalars are merged into the executable schema alongside resolvers.
- Full guide: `packages/core/README.md:1` (Scalars section).

## Directives

- Define directive mappers with `createDirectives` from axolotl-core.
- Each directive is a function `(schema, getDirective) => SchemaMapperInitial` used with `@graphql-tools/utils.mapSchema`.
- Pass them to the adapter as `{ directives }`.

Example `@auth` directive (checks `contextValue.user`):

```ts
import { createDirectives } from '@aexol/axolotl-core';
import { defaultFieldResolver } from 'graphql';
import { MapperKind } from '@graphql-tools/utils';

const directives = createDirectives({
  auth: (schema, getDirective) => ({
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const has = getDirective(schema, fieldConfig, 'auth');
      if (!has) return fieldConfig;
      const { resolve = defaultFieldResolver } = fieldConfig as any;
      return {
        ...fieldConfig,
        resolve: async (src: any, args: any, ctx: any, info: any) => {
          if (!ctx.user) throw new Error('Unauthorized');
          return resolve(src, args, ctx, info);
        },
      } as any;
    },
  }),
});

// Include in adapter
apolloServerAdapter({ resolvers, directives });
```

See core README for a deeper explanation and additional notes.

## Quick Start

```ts
import { Axolotl } from '@aexol/axolotl-core';
import { apolloServerAdapter } from '@aexol/axolotl-apollo-server';

const { createResolvers } = Axolotl(apolloServerAdapter)<{
  Query: { hello: string };
}>();

const resolvers = createResolvers({
  Query: { hello: () => 'world' },
});

const server = apolloServerAdapter({ resolvers });
await server.listen({ port: 4000 });
```

### Quick Start With Scalars

```ts
import { Axolotl } from '@aexol/axolotl-core';
import { apolloServerAdapter } from '@aexol/axolotl-apollo-server';
import { GraphQLScalarType } from 'graphql';

type ScalarModels = { URL: unknown };

const { createResolvers, createScalars } = Axolotl(apolloServerAdapter)<
  { Query: { hello: string } },
  ScalarModels
>();

const scalars = createScalars({
  URL: new GraphQLScalarType({
    name: 'URL',
    serialize: (v) => new URL(String(v)).toString(),
    parseValue: (v) => (v == null ? v : new URL(String(v))),
  }),
});

const resolvers = createResolvers({
  Query: { hello: () => 'world' },
});

const server = apolloServerAdapter({ resolvers, scalars });
await server.listen({ port: 4000 });
```

See `adapters/apollo-server/index.ts:1` for the adapter implementation.
