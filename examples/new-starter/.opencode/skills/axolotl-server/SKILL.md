---
name: axolotl-server
description: Axolotl server setup, axolotl.ts initialization, custom context, scalars, directives, and adapter configuration
---

## Creating axolotl.ts

**Purpose:** Initialize Axolotl framework with adapter and type definitions.

**File: backend/src/axolotl.ts**

### Without Custom Context (Basic)

```typescript
import { Models, Scalars } from '@/src/models.js';
import { Axolotl } from '@aexol/axolotl-core';
import { graphqlYogaAdapter } from '@aexol/axolotl-graphql-yoga';

export const { applyMiddleware, createResolvers, createDirectives, adapter } = Axolotl(graphqlYogaAdapter)<
  Models<{ Secret: number }>, // Models with scalar mappings
  Scalars // Scalar type definitions
>();
```

### With Custom Context (This Project)

**File: backend/src/lib/context.ts**

```typescript
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { YogaInitialContext } from 'graphql-yoga';

// Context exposes raw Node req/res for cookie handling
// Auth is NOT done here — see gateway resolver pattern below
export interface AppContext extends YogaInitialContext {
  req: IncomingMessage;
  res: ServerResponse;
}
```

**File: backend/src/axolotl.ts**

```typescript
import { Directives, Models, Scalars } from '@/src/models.js';
import { Axolotl } from '@aexol/axolotl-core';
import { graphqlYogaWithContextAdapter } from '@aexol/axolotl-graphql-yoga';
import { AppContext } from './lib/context.js';

// Context function simply casts initial — req/res are already present on the Yoga context
const yogaAdapter = graphqlYogaWithContextAdapter<AppContext>((initial) => initial as AppContext);

export const { applyMiddleware, createResolvers, createDirectives, adapter } = Axolotl(yogaAdapter)<
  Models<{ Secret: number; ID: string }>,
  Scalars,
  Directives
>();
```

> **Note:** This project uses the **gateway resolver pattern** for authentication (see the `axolotl-resolvers` skill and the Authentication Architecture section in AGENTS.md), NOT context-level auth. The context only exposes `req`/`res` for cookie access — it does NOT enrich with user data. The auth gateway resolvers (`Query.user` / `Mutation.user`) call `verifyAuth()` directly, and the authenticated user is passed as `source` to child resolvers.

### Alternative: Context-Level Auth (not used in this project)

If you wanted to enrich context with auth data instead of using the gateway resolver pattern, the approach would look like this:

```typescript
import { YogaInitialContext } from 'graphql-yoga';

// Hypothetical context type with auth fields
type AuthContext = YogaInitialContext & {
  userId: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  requestId: string;
};

// Hypothetical context builder that verifies auth on every request
async function buildContext(initial: YogaInitialContext): Promise<AuthContext> {
  // Bearer token from Authorization header
  const token = initial.request.headers.get('authorization')?.replace('Bearer ', '');
  // Or cookie-based: getTokenFromCookies(initial.request.headers.get('cookie'))
  const user = token ? await verifyToken(token) : null;

  return {
    ...initial, // ✅ MUST spread initial context
    userId: user?._id || null,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || false,
    requestId: crypto.randomUUID(),
  };
}

export const { createResolvers, adapter } = Axolotl(graphqlYogaWithContextAdapter<AuthContext>(buildContext))<
  Models<{ Secret: number }>,
  Scalars
>();
```

> This approach runs auth on **every** request at the context level. This project instead uses gateway resolvers to authenticate only the operations that need it — see the Authentication Architecture section in AGENTS.md for details.

**Key Components:**

1. **Import Models, Scalars & Directives** from generated `models.ts`
2. **Import Axolotl** from `@aexol/axolotl-core`
3. **Import adapter** (GraphQL Yoga in this case)
4. **Initialize with generics:**
   - First generic: `Models<ScalarMap>` - your type definitions
   - Second generic: `Scalars` - custom scalar types
   - Third generic (optional): `Directives` - custom directive types

**Exported functions:**

- `createResolvers()` - Create type-safe resolvers
- `createDirectives()` - Create custom directives
- `applyMiddleware()` - Apply middleware to resolvers
- `adapter()` - Configure and start server

**Context Type Safety:**

- `graphqlYogaWithContextAdapter<T>()` takes a **FUNCTION** (not an object)
- Your context type MUST extend `YogaInitialContext`
- The function MUST return an object that includes `...initial`
- Context is automatically typed in ALL resolvers

---

## Server Configuration

**File: backend/src/index.ts**

### Basic Server

```typescript
import { adapter } from '@/src/axolotl.js';
import resolvers from '@/src/resolvers.js';

const { server, yoga } = adapter(
  { resolvers },
  {
    yoga: {
      graphiql: true, // Enable GraphiQL UI
    },
  },
);

server.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
```

### With Custom Scalars

```typescript
import { GraphQLScalarType, Kind } from 'graphql';
import { createScalars } from '@/src/axolotl.js';

const scalars = createScalars({
  Secret: new GraphQLScalarType({
    name: 'Secret',
    serialize: (value) => String(value),
    parseValue: (value) => Number(value),
    parseLiteral: (ast) => {
      if (ast.kind !== Kind.INT) return null;
      return Number(ast.value);
    },
  }),
});

adapter({ resolvers, scalars });
```

### With Directives

Directives add cross-cutting concerns like authentication, authorization, and logging to your schema fields.

```typescript
import { createDirectives } from '@/src/axolotl.js';
import { MapperKind } from '@graphql-tools/utils';
import { defaultFieldResolver, GraphQLError } from 'graphql';

const directives = createDirectives({
  // Directive function signature: (schema, getDirective) => SchemaMapperConfig
  auth: (schema, getDirective) => {
    // Return mapper config object (NOT a schema!)
    return {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        // Check if field has @auth directive
        const authDirective = getDirective(schema, fieldConfig, 'auth')?.[0];

        if (!authDirective) {
          return fieldConfig; // No directive, return unchanged
        }

        // Get original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;

        // Return field with wrapped resolver for runtime behavior
        return {
          ...fieldConfig,
          resolve: async (source, args, context, info) => {
            // This runs on EVERY request to this field
            if (!context.userId) {
              throw new GraphQLError('Not authenticated', {
                extensions: { code: 'UNAUTHORIZED' },
              });
            }

            // Call original resolver
            return resolve(source, args, context, info);
          },
        };
      },
    };
  },
});

adapter({ resolvers, directives });
```

**Schema:**

```graphql
directive @auth on FIELD_DEFINITION

type Query {
  publicData: String!
  protectedData: String! @auth # Only authenticated users
}
```

**Key Points:**

- Directive function receives `(schema, getDirective)` parameters
- Must return mapper config object `{ [MapperKind.X]: ... }`
- Use `getDirective()` to check if field has the directive
- Wrap `resolve` function to add runtime behavior per request
- The adapter calls `mapSchema()` internally - don't call it in your directive

---

## Context Type Safety Cheat Sheet

```typescript
// ✅ CORRECT
type AppContext = YogaInitialContext & { userId: string };

graphqlYogaWithContextAdapter<AppContext>(async (initial) => ({
  ...initial,
  userId: '123',
}));

// ❌ WRONG - Not extending YogaInitialContext
type AppContext = { userId: string };

// ❌ WRONG - Not spreading initial
graphqlYogaWithContextAdapter<AppContext>(async (initial) => ({
  userId: '123', // Missing ...initial
}));

// ❌ WRONG - Passing object instead of function
graphqlYogaWithContextAdapter<AppContext>({ userId: '123' });
```

---

## Quick Reference

| Task                 | Command/Code                                       |
| -------------------- | -------------------------------------------------- |
| Start server         | `adapter({ resolvers }).server.listen(4000)`       |
| Add custom context   | `graphqlYogaWithContextAdapter<Ctx>(contextFn)`    |
| Context must extend  | `YogaInitialContext & { custom }`                  |
| Context must include | `{ ...initial, ...custom }`                        |
| Define scalars       | `createScalars({ ScalarName: GraphQLScalarType })` |
| Define directives    | `createDirectives({ directiveName: mapper })`      |
