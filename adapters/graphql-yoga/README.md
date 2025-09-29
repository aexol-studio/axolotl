# @aexol/axolotl-graphql-yoga

GraphQL Yoga adapter for Axolotl. It wires Axolotl resolvers, scalars and directives into a Yoga server.

## What It Does

- Translates Axolotl resolver signatures to Yoga handlers
- Loads schema from file/content and builds an executable schema
- Applies GraphQL directives via `@graphql-tools/utils` mapping
- Creates a Node HTTP server from Yoga with optional per-request context

## Types Provided

- Resolver input tuple: `[Source, Args, Context]`
- Context type: `Context = YogaInitialContext & Omit<Ctx, keyof YogaInitialContext>`
  - `Ctx` is the generic you pass to `graphqlYogaWithContextAdapter<Ctx>()` to statically augment context
  - You can also provide `options.context(initial: YogaInitialContext)` to build per-request context at runtime
- Directive mapper: `SchemaMapper = (schema: GraphQLSchemaWithContext<YogaInitialContext>, getDirective: typeof getDirectiveFn) => SchemaMapperInitial`
- Adapter factory type: `graphqlYogaWithContextAdapter<Ctx, Context>(customContext?: Ctx)` returns `AxolotlAdapter<[any, any, Context], SchemaMapper>`
- Return value: `{ server: import('http').Server, yoga: ReturnType<typeof createYoga> }`

## Scalars

- Define scalars with `createScalars` from axolotl-core and pass them to the adapter: `graphqlYogaAdapter({ resolvers, scalars })`.
- Scalars are merged into the executable schema alongside resolvers.
- Full guide: `packages/core/README.md:1` (Scalars section).

## Directives

- Define directive mappers with `createDirectives` from axolotl-core.
- Each directive is a function `(schema, getDirective) => SchemaMapperInitial` used with `@graphql-tools/utils.mapSchema`.
- Pass them to the adapter as `{ directives }`.

Example `@auth` directive (blocks access without header):

```ts
import { createDirectives } from '@aexol/axolotl-core';
import { defaultFieldResolver } from 'graphql';
import { MapperKind } from '@graphql-tools/utils';
import type { YogaInitialContext } from 'graphql-yoga';

const directives = createDirectives({
  auth: (schema, getDirective) => ({
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const has = getDirective(schema, fieldConfig, 'auth');
      if (!has) return fieldConfig;
      const { resolve = defaultFieldResolver } = fieldConfig as any;
      return {
        ...fieldConfig,
        resolve: async (src: any, args: any, ctx: YogaInitialContext, info: any) => {
          if (ctx.request.headers.get('auth') !== 'password') throw new Error('Unauthorized');
          return resolve(src, args, ctx, info);
        },
      } as any;
    },
  }),
});

// Include in adapter
graphqlYogaAdapter({ resolvers, directives });
```

See core README for a deeper explanation and additional notes.

## Quick Start

```ts
import { Axolotl } from '@aexol/axolotl-core';
import { graphqlYogaAdapter } from '@aexol/axolotl-graphql-yoga';

const { createResolvers } = Axolotl(graphqlYogaAdapter)<{
  Query: { hello: string };
}>();

const resolvers = createResolvers({
  Query: { hello: () => 'world' },
});

const { server } = graphqlYogaAdapter({ resolvers }).adapter({ resolvers });
server.listen(4000);
```

### Quick Start With Scalars

```ts
import { Axolotl } from '@aexol/axolotl-core';
import { graphqlYogaAdapter } from '@aexol/axolotl-graphql-yoga';
import { GraphQLScalarType } from 'graphql';

type ScalarModels = { URL: unknown };

const { createResolvers, createScalars } = Axolotl(graphqlYogaAdapter)<
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

graphqlYogaAdapter({ resolvers, scalars }).server.listen(4000);
```

See `adapters/graphql-yoga/index.ts:1` for the adapter implementation.
