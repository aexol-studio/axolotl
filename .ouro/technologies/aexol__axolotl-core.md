# @aexol/axolotl-core — README (from npm)

# @aexol/axolotl-core

Axolotl’s core library. It provides the type-safe, schema-first building blocks used by adapters and apps.

- Axolotl runtime primitives (`Axolotl`, `AxolotlAdapter`)
- Helpers to create resolvers, scalars, directives, and apply middleware
- Utilities for schema inspection, federation, model generation, and chaos testing

## Key APIs

- `Axolotl(adapter)<Models, Scalars, Directives>()` – bootstraps a project with a selected adapter
- `createResolvers`, `createScalars`, `createDirectives`, `applyMiddleware` – author resolvers and plug middleware
- `setSourceTypeFromResolver` – infer source type from a resolver
- `generateModels`, `inspectResolvers`, `createSuperGraph`, `chaos` – utilities used by the CLI

See `packages/core/index.ts:1` for exports and `packages/core/types.ts:1` for types.

## When To Use

- Building GraphQL servers with strong typing over your schema
- Sharing common logic across adapters (Yoga, Apollo) and examples

## Develop

- Build: `npm run build --ws --if-present`
- Test: `npm test`
- Lint: `npx eslint packages/core`

---

### Minimal Example (with an adapter)

```ts
import { Axolotl } from '@aexol/axolotl-core';
import { graphqlYogaAdapter } from '@aexol/axolotl-graphql-yoga';

const { createResolvers } = Axolotl(graphqlYogaAdapter)<{
  Query: { hello: string };
}>();

export const resolvers = createResolvers({
  Query: {
    hello: async () => 'world',
  },
});
```

## Scalars

Axolotl lets you define GraphQL custom scalars in a type‑safe way and pass them to your adapter.

1) Declare the scalar in your SDL and regenerate models if you use codegen

```graphql
scalar URL

type Beer {
  url: URL
}
```

2) Type your scalar map via the second generic argument to `Axolotl` and implement with `createScalars`

```ts
import { Axolotl } from '@aexol/axolotl-core';
import { GraphQLScalarType, Kind } from 'graphql';
import { graphqlYogaAdapter } from '@aexol/axolotl-graphql-yoga';

type ScalarModels = { URL: unknown };

const { createScalars, createResolvers } = Axolotl(graphqlYogaAdapter)<
  { Query: { ping: string } },
  ScalarModels
>();

const scalars = createScalars({
  URL: new GraphQLScalarType({
    name: 'URL',
    serialize(value) {
      return new URL(String(value)).toString();
    },
    parseValue(value) {
      return value == null ? value : new URL(String(value));
    },
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) return null;
      try {
        return new URL(ast.value);
      } catch {
        return null;
      }
    },
  }),
});

const resolvers = createResolvers({
  Query: { ping: () => 'pong' },
});

// Pass scalars to the adapter alongside resolvers
graphqlYogaAdapter({ resolvers, scalars });
```

Notes
- `createScalars({...})` is typed: keys must match your `ScalarModels` keys.
- Provide at least `serialize` and `parseValue`; `parseLiteral` is recommended for literal input handling.
- All adapters merge scalars into the executable schema next to your resolvers.

## Directives

Axolotl lets adapters apply GraphQL directives by mapping them to field/config transforms.

- The third generic to `Axolotl(...)<Models, Scalars, Directives>()` controls the available directive names.
- Use `createDirectives` to define mappers. Each directive is an adapter‑specific function that returns a `SchemaMapper` (see adapter docs).
- Pass the resulting `directives` object to your adapter along with `resolvers` and `scalars`.

Example (Yoga adapter shown):

```ts
import { Axolotl } from '@aexol/axolotl-core';
import { graphqlYogaWithContextAdapter } from '@aexol/axolotl-graphql-yoga';
import { defaultFieldResolver } from 'graphql';
import { MapperKind } from '@graphql-tools/utils';

type DirModels = { auth: { args: Record<string, never> } };

const { createDirectives, createResolvers } = Axolotl(graphqlYogaWithContextAdapter())<
  { Query: { secret: string } },
  {},
  DirModels
>();

const directives = createDirectives({
  auth: (schema, getDirective) => ({
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const has = getDirective(schema, fieldConfig, 'auth');
      if (!has) return fieldConfig;
      const { resolve = defaultFieldResolver } = fieldConfig as any;
      return {
        ...fieldConfig,
        resolve: async (parent: any, args: any, ctx: any, info: any) => {
          if (!ctx.userId) throw new Error('Not authorized');
          return resolve(parent, args, ctx, info);
        },
      } as any;
    },
  }),
});

const resolvers = createResolvers({
  Query: { secret: () => 'top secret' },
});

// Include directives when creating the server
graphqlYogaWithContextAdapter()({ resolvers, directives });
```

Notes
- Directive implementations are adapter‑specific. See adapter READMEs for types and context signatures.
