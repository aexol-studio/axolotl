---
name: axolotl-server
description: Axolotl server setup, axolotl.ts initialization, custom context, scalars, directives, and adapter configuration
---

## axolotl.ts Initialization

```typescript
// Root src/axolotl.ts — passes context builder function
const yogaAdapter = graphqlYogaWithContextAdapter<AppContext>(async (initial) => {
  // ... auth verification, setCookie/clearCookie closures
  return { ...initial, authUser, setCookie, clearCookie };
});
export const { createResolvers, createDirectives, applyMiddleware, adapter } = Axolotl(yogaAdapter)<
  Models<{ Secret: number; ID: string }>,
  Scalars,
  Directives
>();

// Module src/modules/myModule/axolotl.ts — type-only, no builder
const yogaAdapter = graphqlYogaWithContextAdapter<AppContext>();
export const { createResolvers } = Axolotl(yogaAdapter)<ModuleModels>();
```

- Both root and modules use `graphqlYogaWithContextAdapter<AppContext>()`
- Root passes a builder function — modules pass nothing (type-only)
- Builder must return `{ ...initial, ...customFields }` — spreading `initial` is **mandatory**
- Context type **must** extend `YogaInitialContext`
- Context is auto-typed in resolvers — **never cast with `as AppContext`**
- **Never `as any`** — use `as unknown as T` for structural incompatibility

## Context Type

```typescript
import type { YogaInitialContext } from 'graphql-yoga';

export type AuthUser = { _id: string; email: string; jti: string };

export interface AppContext extends YogaInitialContext {
  authUser?: AuthUser;
  setCookie: (token: string) => void;
  clearCookie: () => void;
}
```

## Context Builder with Auth

```typescript
// axolotl.ts — verifies auth on every request (try/catch, non-throwing)
const yogaAdapter = graphqlYogaWithContextAdapter<AppContext>(async (initial) => {
  const cookieHeader = initial.request.headers.get('cookie');
  const tokenHeader = initial.request.headers.get('token');

  let authUser: AppContext['authUser'];
  try {
    authUser = await verifyAuth(cookieHeader, tokenHeader);
  } catch {
    authUser = undefined;
  }

  return { ...initial, authUser, setCookie, clearCookie };
});
// setCookie/clearCookie are closures created from the response object — see context.ts
```

**Common mistakes:**

- ❌ `type AppContext = { userId: string }` — not extending `YogaInitialContext`
- ❌ `(initial) => ({ userId: '123' })` — missing `...initial`
- ❌ `graphqlYogaWithContextAdapter<AppContext>({ userId: '123' })` — must pass a function

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
          if (!context.authUser) throw new GraphQLError('Not authenticated');
          return resolve(source, args, context, info);
        },
      };
    },
  }),
});

adapter({ resolvers, directives });
```

- Directive signature: `(schema, getDirective) => { [MapperKind.X]: fieldMapper }`
- Adapter calls `mapSchema()` internally — don't call it yourself

## Express Bridge

```typescript
// ✅ correct
app.use('/graphql', yoga as unknown as express.RequestHandler);
// ❌ wrong
app.use('/graphql', yoga as any);
```
