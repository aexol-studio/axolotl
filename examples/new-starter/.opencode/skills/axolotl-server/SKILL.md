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

### With Custom Context (Recommended)

```typescript
import { Models, Scalars } from '@/src/models.js';
import { Axolotl } from '@aexol/axolotl-core';
import { graphqlYogaWithContextAdapter } from '@aexol/axolotl-graphql-yoga';
import { YogaInitialContext } from 'graphql-yoga';

// Define your context type - MUST extend YogaInitialContext
type AppContext = YogaInitialContext & {
  userId: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  requestId: string;
};

// Context builder function
async function buildContext(initial: YogaInitialContext): Promise<AppContext> {
  const token = initial.request.headers.get('authorization')?.replace('Bearer ', '');
  const user = token ? await verifyToken(token) : null;

  return {
    ...initial, // ✅ MUST spread initial context
    userId: user?._id || null,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || false,
    requestId: crypto.randomUUID(),
  };
}

export const { createResolvers, adapter } = Axolotl(graphqlYogaWithContextAdapter<AppContext>(buildContext))<
  Models<{ Secret: number }>,
  Scalars
>();
```

**Key Components:**

1. **Import Models & Scalars** from generated `models.ts`
2. **Import Axolotl** from `@aexol/axolotl-core`
3. **Import adapter** (GraphQL Yoga in this case)
4. **Initialize with generics:**
   - First generic: `Models<ScalarMap>` - your type definitions
   - Second generic: `Scalars` - custom scalar types

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
