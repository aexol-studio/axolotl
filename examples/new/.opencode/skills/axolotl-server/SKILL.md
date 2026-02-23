---
name: axolotl-server
description: Axolotl server setup, axolotl.ts initialization, custom context, scalars, directives, and adapter configuration
---

## axolotl.ts Initialization

```typescript
// Without custom context
export const { createResolvers, createDirectives, applyMiddleware, adapter } = Axolotl(graphqlYogaAdapter)<
  Models<{ Secret: number }>,
  Scalars
>();

// With custom context
const yogaAdapter = graphqlYogaWithContextAdapter<AppContext>((initial) => initial as AppContext);
export const { createResolvers, createDirectives, applyMiddleware, adapter } = Axolotl(yogaAdapter)<
  Models<{ Secret: number; ID: string }>,
  Scalars,
  Directives
>();
```

- Module resolver files use `graphqlYogaAdapter`
- Root `axolotl.ts` uses `graphqlYogaWithContextAdapter<T>(buildContext)` when custom context is needed
- `buildContext` must return `{ ...initial, ...customFields }` — spreading `initial` is mandatory
- Context type **must** extend `YogaInitialContext`
- **Never use `as any`** — use `as unknown as T` for structural incompatibility (e.g. Express bridge)

## Context Type

```typescript
// context.ts
export interface AppContext extends YogaInitialContext {
  // ✅ must extend
  req: IncomingMessage;
  res: ServerResponse;
}

// axolotl.ts — builder must spread initial
const yogaAdapter = graphqlYogaWithContextAdapter<AppContext>(
  async (initial) => ({ ...initial, myField: value }), // ✅ ...initial required
);
```

❌ `type AppContext = { userId: string }` — not extending `YogaInitialContext`  
❌ `(initial) => ({ userId: '123' })` — missing `...initial`  
❌ `graphqlYogaWithContextAdapter<AppContext>({ userId: '123' })` — must pass a function

## Custom Scalars

```typescript
import { createScalars } from '@/src/axolotl.js';
import { GraphQLScalarType, Kind } from 'graphql';

const scalars = createScalars({
  Secret: new GraphQLScalarType({
    name: 'Secret',
    serialize: (v) => String(v),
    parseValue: (v) => Number(v),
    parseLiteral: (ast) => (ast.kind === Kind.INT ? Number(ast.value) : null),
  }),
});

adapter({ resolvers, scalars });
```

## Custom Directives

```typescript
import { createDirectives } from '@/src/axolotl.js';
import { MapperKind } from '@graphql-tools/utils';
import { defaultFieldResolver } from 'graphql';

const directives = createDirectives({
  auth: (schema, getDirective) => ({
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      if (!getDirective(schema, fieldConfig, 'auth')?.[0]) return fieldConfig;
      const { resolve = defaultFieldResolver } = fieldConfig;
      return {
        ...fieldConfig,
        resolve: async (source, args, context, info) => {
          if (!context.userId) throw new GraphQLError('Not authenticated');
          return resolve(source, args, context, info);
        },
      };
    },
  }),
});

adapter({ resolvers, directives });
```

- Directive fn signature: `(schema, getDirective) => { [MapperKind.X]: fieldMapper }`
- Return mapper config object — the adapter calls `mapSchema()` internally, don't call it yourself

## Express Bridge (no `as any`)

```typescript
// ✅ correct double-cast
app.use('/graphql', yoga as unknown as express.RequestHandler);
// ❌ wrong
app.use('/graphql', yoga as any);
```
