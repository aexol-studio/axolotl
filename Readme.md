# Axolotl Framework - LLM Integration Guide

## Overview

Axolotl is a **type-safe, schema-first GraphQL framework** that generates TypeScript types from your GraphQL schema and provides full type safety for resolvers. This guide provides exact instructions for LLMs to work with Axolotl projects.

## Core Concepts

### 1. Schema-First Development

- Write GraphQL schema in `.graphql` files
- Axolotl CLI generates TypeScript types automatically
- Resolvers are fully typed based on the schema

### 2. File Structure

```
project/
├── axolotl.json          # Configuration file
├── schema.graphql        # GraphQL schema
├── src/
│   ├── axolotl.ts       # Framework initialization
│   ├── models.ts        # Auto-generated types (DO NOT EDIT)
│   ├── resolvers.ts     # Resolver implementations
│   └── index.ts         # Server entry point
```

---

## Critical Rules for LLMs

**ALWAYS follow these rules when working with Axolotl:**

1. **NEVER edit models.ts manually** - always regenerate with `axolotl build`
2. **ALWAYS use .js extensions** in imports (ESM requirement)
3. **ALWAYS run axolotl build** after schema changes
4. **CRITICAL: Resolver signature is** `(input, args)` where `input = [source, args, context]`
5. **CRITICAL: Access context as** `input[2]` or `([, , context])`
6. **CRITICAL: Access parent/source as** `input[0]` or `([source])`
7. **CRITICAL: Context type must** extend `YogaInitialContext` and spread `...initial`
8. **Import from axolotl.ts** - never from @aexol/axolotl-core directly in resolver files
9. **Use createResolvers()** for ALL resolver definitions
10. **Use mergeAxolotls()** to combine multiple resolver sets
11. **Return empty object `{}`** for nested resolver enablement
12. **Context typing** requires `graphqlYogaWithContextAdapter<T>(contextFunction)`

---

## STEP 1: Understanding axolotl.json

The `axolotl.json` configuration file defines:

```json
{
  "schema": "schema.graphql", // Path to main schema
  "models": "src/models.ts", // Where to generate types
  "federation": [
    // Optional: for micro-federation
    {
      "schema": "src/todos/schema.graphql",
      "models": "src/todos/models.ts"
    }
  ],
  "zeus": [
    // Optional: GraphQL client generation
    {
      "generationPath": "src/"
    }
  ]
}
```

**Instructions:**

- Read `axolotl.json` first to understand project structure
- NEVER edit `axolotl.json` unless explicitly asked
- Use paths from config to locate schema and models

---

## STEP 2: GraphQL Schema (schema.graphql)

**Example:**

```graphql
scalar Secret

type User {
  _id: String!
  username: String!
}

type Query {
  user: AuthorizedUserQuery @resolver
  hello: String!
}

type Mutation {
  login(username: String!, password: String!): String! @resolver
}

directive @resolver on FIELD_DEFINITION

schema {
  query: Query
  mutation: Mutation
}
```

**Key Points:**

- This is the source of truth for your API
- The `@resolver` directive marks fields that need resolver implementations
- After modifying schema, ALWAYS run: `npx @aexol/axolotl build`

---

## STEP 3: Models Generation

**Command:**

```bash
npx @aexol/axolotl build
# Or with custom directory:
npx @aexol/axolotl build --cwd path/to/project
```

**What it does:**

- Reads `schema.graphql`
- Generates TypeScript types in `src/models.ts`
- Creates type definitions for Query, Mutation, Subscription, and all types

**Generated models.ts structure:**

```typescript
// AUTO-GENERATED - DO NOT EDIT

export type Scalars = {
  ['Secret']: unknown;
};

export type Models<S extends { [P in keyof Scalars]: any }> = {
  ['User']: {
    _id: { args: Record<string, never> };
    username: { args: Record<string, never> };
  };
  ['Query']: {
    hello: { args: Record<string, never> };
    user: { args: Record<string, never> };
  };
  ['Mutation']: {
    login: {
      args: {
        username: string;
        password: string;
      };
    };
  };
};
```

---

## STEP 3.5: Generate Resolver Boilerplate (Optional but Recommended)

**Command:**

```bash
npx @aexol/axolotl resolvers
```

**What it does:**

- Reads your schema and finds all fields marked with `@resolver` directive
- Generates organized resolver file structure automatically
- Creates placeholder implementations for each resolver field
- Sets up proper import structure and type safety

**Generated structure example:**

Given a schema with `@resolver` directives:

```graphql
type Query {
  user: AuthorizedUserQuery @resolver
  hello: String!
}

type Mutation {
  login(username: String!, password: String!): String! @resolver
}
```

The command generates:

```
src/
├── resolvers/
│   ├── Query/
│   │   ├── user.ts          # Individual field resolver
│   │   └── resolvers.ts     # Query type aggregator
│   ├── Mutation/
│   │   ├── login.ts         # Individual field resolver
│   │   └── resolvers.ts     # Mutation type aggregator
│   └── resolvers.ts         # Root aggregator (export this)
```

**Generated file example (Query/user.ts):**

```typescript
import { createResolvers } from '../../axolotl.js';

export default createResolvers({
  Query: {
    user: async ([parent, details, ctx], args) => {
      // TODO: implement resolver for Query.user
      throw new Error('Not implemented: Query.user');
    },
  },
});
```

**Generated aggregator (Query/resolvers.ts):**

```typescript
import { createResolvers } from '../../axolotl.js';
import user from './user.js';

export default createResolvers({
  Query: {
    ...user.Query,
  },
});
```

**Root aggregator (resolvers/resolvers.ts):**

```typescript
import { createResolvers } from '../axolotl.js';
import Query from './Query/resolvers.js';
import Mutation from './Mutation/resolvers.js';

export default createResolvers({
  ...Query,
  ...Mutation,
});
```

**Key Benefits:**

- **Automatic scaffolding** - No manual file/folder creation needed
- **Organized structure** - Each resolver in its own file
- **Type safety** - All generated files use `createResolvers()` correctly
- **Non-destructive** - Only creates files that don't exist (won't overwrite your implementations)
- **Aggregator files always updated** - Type-level and root aggregators are regenerated to stay in sync

**When to use:**

- ✅ Starting a new project with many resolvers
- ✅ Adding new resolver fields to existing schema
- ✅ Want organized, maintainable resolver structure
- ✅ Working with federated schemas (generates for each module)

**Workflow:**

1. Add `@resolver` directives to schema fields
2. Run `npx @aexol/axolotl build` to update types
3. Run `npx @aexol/axolotl resolvers` to scaffold structure
4. Implement TODO sections in generated resolver files
5. Import and use `resolvers/resolvers.ts` in your server

**Note for Federated Projects:**

The command automatically detects federation in `axolotl.json` and generates resolver structures for each federated schema in the appropriate directories.

---

## STEP 4: Creating axolotl.ts

**Purpose:** Initialize Axolotl framework with adapter and type definitions.

**File: src/axolotl.ts**

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

## STEP 5: Writing Resolvers

### Resolver Signature

**The resolver signature is:**

```typescript
(input, args) => ReturnType;
```

Where:

- **`input`** is a tuple: `[source, args, context]`
  - `input[0]` = **source** (parent value)
  - `input[1]` = **args** (field arguments)
  - `input[2]` = **context** (request context)
- **`args`** is also provided as second parameter for convenience

### Simple Resolver Example

```typescript
import { createResolvers } from '@/src/axolotl.js';

export default createResolvers({
  Query: {
    hello: async ([source, args, context]) => {
      //              ↑      ↑      ↑
      //           input[0] [1]    [2]
      return 'Hello, World!';
    },
  },
  Mutation: {
    login: async ([source, args, context], { username, password }) => {
      //            ↑ Destructure tuple    ↑ Convenience args parameter
      const token = await authenticateUser(username, password);
      return token;
    },
  },
});
```

### Common Destructuring Patterns

```typescript
// Pattern 1: Access context only
createResolvers({
  Query: {
    me: async ([, , context]) => {
      return getUserById(context.userId);
    },
  },
});

// Pattern 2: Access source and context
createResolvers({
  AuthorizedUserQuery: {
    todos: async ([source, , context]) => {
      const src = source as { _id: string };
      return getTodosByUserId(src._id);
    },
  },
});

// Pattern 3: Use convenience args parameter
createResolvers({
  Mutation: {
    createTodo: async ([, , context], { content }) => {
      return createTodo(content, context.userId);
    },
  },
});

// Pattern 4: Ignore unused with underscores
createResolvers({
  Query: {
    me: async ([_, __, context]) => {
      return getUserById(context.userId);
    },
  },
});
```

### Accessing Parent (Source) in Nested Resolvers

In nested resolvers, the **parent** (also called **source**) is the value returned by the parent resolver.

```typescript
// Schema
type Query {
  user: AuthorizedUserQuery @resolver
}

type AuthorizedUserQuery {
  me: User! @resolver
  todos: [Todo!] @resolver
}

// Resolvers
createResolvers({
  Query: {
    user: async ([, , context]) => {
      const token = context.request.headers.get('authorization');
      const user = await verifyToken(token);

      // This object becomes the SOURCE for AuthorizedUserQuery resolvers
      return {
        _id: user._id,
        username: user.username,
      };
    },
  },
  AuthorizedUserQuery: {
    me: ([source]) => {
      // source is what Query.user returned
      const src = source as { _id: string; username: string };
      return src;
    },
    todos: async ([source]) => {
      // Access parent data
      const src = source as { _id: string };
      return getTodosByUserId(src._id);
    },
  },
});
```

### Typing the Parent (Two Methods)

**Method 1: Type Assertion (Simple)**

```typescript
type UserSource = {
  _id: string;
  username: string;
  token?: string;
};

export default createResolvers({
  AuthorizedUserQuery: {
    me: ([source]) => {
      const src = source as UserSource;
      return {
        _id: src._id,
        username: src.username,
      };
    },
  },
});
```

**Method 2: Using setSourceTypeFromResolver (Advanced)**

```typescript
import { createResolvers, setSourceTypeFromResolver } from '@aexol/axolotl-core';

const getUserResolver = async ([, , context]) => {
  const user = await authenticateUser(context);
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
  };
};

const getUser = setSourceTypeFromResolver(getUserResolver);

export default createResolvers({
  Query: {
    user: getUserResolver,
  },
  AuthorizedUserQuery: {
    me: ([source]) => {
      const src = getUser(source); // src is now fully typed
      return src;
    },
  },
});
```

### Organized Resolver Structure (Recommended)

```typescript
// src/resolvers/Query/resolvers.ts
import { createResolvers } from '../axolotl.js';
import user from './user.js';

export default createResolvers({
  Query: {
    ...user.Query,
  },
});

// src/resolvers/Query/user.ts
import { createResolvers } from '../axolotl.js';

export default createResolvers({
  Query: {
    user: async ([, , context]) => {
      // Return object to enable nested resolvers
      return {};
    },
  },
});

// Main resolvers.ts
import { mergeAxolotls } from '@aexol/axolotl-core';
import QueryResolvers from '@/src/resolvers/Query/resolvers.js';
import MutationResolvers from '@/src/resolvers/Mutation/resolvers.js';

export default mergeAxolotls(QueryResolvers, MutationResolvers);
```

**Key Points:**

- Arguments are automatically typed from schema
- Return types must match schema definitions
- For nested resolvers, return an empty object `{}` in parent resolver
- Always use async functions (best practice)

---

## STEP 6: Server Configuration

**File: src/index.ts**

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

```typescript
import { createDirectives } from '@/src/axolotl.js';
import { MapperKind } from '@graphql-tools/utils';
import { defaultFieldResolver } from 'graphql';

const directives = createDirectives({
  auth: (schema, getDirective) => ({
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const hasDirective = getDirective(schema, fieldConfig, 'auth');
      if (!hasDirective) return fieldConfig;

      const { resolve = defaultFieldResolver } = fieldConfig as any;
      return {
        ...fieldConfig,
        resolve: async (source, args, context, info) => {
          if (!context.userId) {
            throw new Error('Not authenticated');
          }
          return resolve(source, args, context, info);
        },
      } as any;
    },
  }),
});

adapter({ resolvers, directives });
```

---

## STEP 7: Micro-Federation (Optional)

**Purpose:** Merge multiple GraphQL schemas and resolvers into one API.

**Configuration in axolotl.json:**

```json
{
  "schema": "schema.graphql",
  "models": "src/models.ts",
  "federation": [
    {
      "schema": "src/todos/schema.graphql",
      "models": "src/todos/models.ts"
    },
    {
      "schema": "src/users/schema.graphql",
      "models": "src/users/models.ts"
    }
  ]
}
```

**Each module has its own:**

- `schema.graphql`
- `models.ts` (generated)
- `axolotl.ts` (module-specific initialization)
- Resolvers

**Module axolotl.ts:**

```typescript
// src/todos/axolotl.ts
import { Models } from '@/src/todos/models.js';
import { Axolotl } from '@aexol/axolotl-core';
import { graphqlYogaAdapter } from '@aexol/axolotl-graphql-yoga';

export const { createResolvers } = Axolotl(graphqlYogaAdapter)<Models>();
```

**Main resolvers (merge):**

```typescript
// src/resolvers.ts
import { mergeAxolotls } from '@aexol/axolotl-core';
import todosResolvers from '@/src/todos/resolvers/resolvers.js';
import usersResolvers from '@/src/users/resolvers/resolvers.js';

export default mergeAxolotls(todosResolvers, usersResolvers);
```

**Key Points:**

- Run `axolotl build` to generate ALL models (main + federated)
- Each module has its own axolotl.ts using its own models
- Merge all resolvers using `mergeAxolotls()`
- Schema files are merged automatically by CLI

---

## Common Commands

```bash
# Create new Axolotl project with Yoga
npx @aexol/axolotl create-yoga my-project

# Generate models from schema
npx @aexol/axolotl build

# Generate models with custom directory
npx @aexol/axolotl build --cwd path/to/project

# Generate resolver boilerplate from @resolver directives
npx @aexol/axolotl resolvers


# Inspect resolvers (find unimplemented @resolver fields)
npx @aexol/axolotl inspect -s schema.graphql -r lib/resolvers.js
```

### Inspect Command

The `inspect` command identifies which resolvers marked with `@resolver` directive are not yet implemented:

```bash
npx @aexol/axolotl inspect -s ./schema.graphql -r ./lib/resolvers.js
```

**What it does:**
- Finds all fields marked with `@resolver` directive in your schema
- Checks if resolvers are missing or still contain stub implementations
- Reports only unimplemented resolvers (not all schema fields)

**Example output:**
```
Resolvers that need implementation:

⚠️ Query.users - throws "Not implemented"
❌ Mutation.login - not found
❌ Mutation.register - not found

Total: 3 resolver(s) to implement
```

**Status indicators:**
- ✅ All implemented - Command exits with code 0
- ⚠️ Stub - Resolver exists but throws "Not implemented" error
- ❌ Missing - No resolver function exists for this field

**Tip:** Use `npx @aexol/axolotl resolvers` to generate stubs, then use `inspect` to track implementation progress.

---
```

---

## LLM Workflow Checklist

When working with an Axolotl project:

1. ✅ **Read axolotl.json** to understand structure
2. ✅ **Check schema.graphql** for current schema
3. ✅ **Verify models.ts is up-to-date** (regenerate if needed)
4. ✅ **Locate axolotl.ts** to understand initialization
5. ✅ **Find resolver files** and understand structure
6. ✅ **Make schema changes** if requested
7. ✅ **Run `axolotl build`** after schema changes
8. ✅ **Optionally run `axolotl resolvers`** to scaffold new resolver files
9. ✅ **Update resolvers** to match new types
10. ✅ **Test** that server starts without type errors

---

## Common Patterns Cheat Sheet

### Context Type Safety

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

### Resolver Patterns

```typescript
// Type-safe arguments (auto-typed from schema)
createResolvers({
  Query: {
    user: async ([, , context], { id, includeEmail }) => {
      // id: string, includeEmail: boolean | undefined
      return getUserById(id, includeEmail);
    },
  },
});

// Nested resolvers
createResolvers({
  Query: {
    user: async ([, , context]) => {
      return {}; // Enable nested resolvers
    },
  },
  UserQuery: {
    me: async ([, , context]) => {
      return getUserById(context.userId);
    },
  },
});
```

---

## Troubleshooting

### Type errors in resolvers

**Solution:** Run `npx @aexol/axolotl build` to regenerate models

### Scalar types showing as 'unknown'

**Solution:** Map scalars in axolotl.ts:

```typescript
Axolotl(adapter)<Models<{ MyScalar: string }>, Scalars>();
```

### Context type not recognized

**Solution:** Use `graphqlYogaWithContextAdapter<YourContextType>(contextFunction)`

### Context properties undefined

**Solution:** Make sure you spread `...initial` when building context

---

## Quick Reference

| Task                 | Command/Code                                                |
| -------------------- | ----------------------------------------------------------- |
| Initialize project   | `npx @aexol/axolotl create-yoga <name>`                     |
| Generate types       | `npx @aexol/axolotl build`                                  |
| Scaffold resolvers   | `npx @aexol/axolotl resolvers`                              |
| Create resolvers     | `createResolvers({ Query: {...} })`                         |
| Access context       | `([, , context])` - third in tuple                          |
| Access parent        | `([source])` - first in tuple                               |
| Merge resolvers      | `mergeAxolotls(resolvers1, resolvers2)`                     |
| Start server         | `adapter({ resolvers }).server.listen(4000)`                |
| Add custom context   | `graphqlYogaWithContextAdapter<Ctx>(contextFn)`             |
| Context must extend  | `YogaInitialContext & { custom }`                           |
| Context must include | `{ ...initial, ...custom }`                                 |
| Define scalars       | `createScalars({ ScalarName: GraphQLScalarType })`          |
| Define directives    | `createDirectives({ directiveName: mapper })`               |
| Inspect resolvers    | `npx @aexol/axolotl inspect -s schema.graphql -r resolvers` |

---

This guide provides everything an LLM needs to work effectively with Axolotl projects, from understanding the structure to implementing resolvers with full type safety.
