# Axolotl Framework - LLM Integration Guide

## Overview

Axolotl is a **type-safe, schema-first GraphQL framework** that generates TypeScript types from your GraphQL schema and provides full type safety for resolvers. This guide provides exact instructions for LLMs to work with Axolotl projects.

This example project (`yoga-federated`) is a **full-stack application** featuring:

- GraphQL backend with micro-federation
- React frontend with Vite SSR
- Zustand state management
- AI chat via GraphQL subscriptions (Vercel AI SDK)
- Prisma schema (ready for PostgreSQL)

## Core Concepts

### 1. Schema-First Development

- Write GraphQL schema in `.graphql` files
- Axolotl CLI generates TypeScript types automatically
- Resolvers are fully typed based on the schema

### 2. File Structure

```
project/
├── axolotl.json          # Configuration file
├── schema.graphql        # Merged GraphQL schema (auto-generated)
├── prisma/
│   └── schema.prisma     # Prisma database schema
├── frontend/             # React frontend with SSR
│   ├── src/
│   │   ├── api/          # GraphQL client (Zeus)
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── routes/       # Page components
│   │   ├── stores/       # Zustand state stores
│   │   └── zeus/         # Auto-generated GraphQL client
│   └── index.html
├── src/
│   ├── ai/              # AI providers (OpenAI integration)
│   ├── todos/           # Todos federation module
│   ├── users/           # Users federation module
│   ├── axolotl.ts       # Framework initialization
│   ├── models.ts        # Auto-generated types (DO NOT EDIT)
│   ├── resolvers.ts     # Merged resolver implementations
│   ├── directives.ts    # Custom GraphQL directives
│   └── index.ts         # Express + Vite SSR server entry
├── vite.config.ts       # Vite configuration for SSR
└── docker-compose.yml   # Docker setup with PostgreSQL
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
  ],
  "zeus": [
    {
      "generationPath": "frontend/src",
      "esModule": true
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
import { Directives, Models, Scalars } from '@/src/models.js';
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
    ...initial, // MUST spread initial context
    userId: user?._id || null,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || false,
    requestId: crypto.randomUUID(),
  };
}

export const { createResolvers, adapter } = Axolotl(graphqlYogaWithContextAdapter<AppContext>(buildContext))<
  Models<{ Secret: number }>,
  Scalars,
  Directives
>();
```

**Note:** This project uses the simpler adapter without custom context:

```typescript
// src/axolotl.ts (actual implementation)
import { Directives, Models, Scalars } from '@/src/models.js';
import { Axolotl } from '@aexol/axolotl-core';
import { graphqlYogaAdapter } from '@aexol/axolotl-graphql-yoga';

export const { applyMiddleware, createResolvers, createDirectives, adapter } = Axolotl(graphqlYogaAdapter)<
  Models<{ Secret: number; ID: string }>,
  Scalars,
  Directives
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

## STEP 6: Subscriptions

**Purpose:** Enable real-time updates via GraphQL Subscriptions.

### Defining Subscriptions in Schema

Add a `Subscription` type to your schema:

```graphql
type Subscription {
  countdown(from: Int): Int @resolver
  messageAdded: Message @resolver
}

schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
```

### Creating Subscription Resolvers

**CRITICAL:** All subscription resolvers **MUST** use `createSubscriptionHandler` from `@aexol/axolotl-core`.

```typescript
import { createResolvers, createSubscriptionHandler } from '@aexol/axolotl-core';
import { setTimeout as setTimeout$ } from 'node:timers/promises';

export default createResolvers({
  Subscription: {
    // Simple countdown subscription
    countdown: createSubscriptionHandler(async function* (input, { from }) {
      // input is [source, args, context] - same as regular resolvers
      const [, , context] = input;

      for (let i = from || 10; i >= 0; i--) {
        await setTimeout$(1000);
        yield i;
      }
    }),

    // Event-based subscription with PubSub
    messageAdded: createSubscriptionHandler(async function* (input) {
      const [, , context] = input;
      const channel = context.pubsub.subscribe('MESSAGE_ADDED');

      for await (const message of channel) {
        yield message;
      }
    }),
  },
});
```

### Key Points:

1. **Always use `createSubscriptionHandler`** - It wraps your async generator function
2. **Use async generators** - Functions with `async function*` that yield values
3. **Yield values directly** - GraphQL automatically wraps the yielded value in `{ [fieldName]: yieldedValue }` format
4. **Access context** - Same `[source, args, context]` signature as regular resolvers
5. **Works with GraphQL Yoga** - Supports both SSE and WebSocket transports

### CRITICAL: Subscription Return Format

GraphQL subscriptions automatically wrap yielded values. You should yield the **value directly**, NOT wrapped in the field name:

```typescript
// ✅ CORRECT - yield the value directly
createSubscriptionHandler(async function* () {
  yield { type: 'CREATED', todo: { _id: '123', content: 'Test' } };
  // GraphQL returns: { "data": { "todoUpdates": { "type": "CREATED", "todo": {...} } } }
});

// ❌ WRONG - do NOT wrap in field name
createSubscriptionHandler(async function* () {
  yield { todoUpdates: { type: 'CREATED', todo: {...} } };
  // This would result in: { "data": { "todoUpdates": { "todoUpdates": {...} } } }
});
```

The GraphQL layer handles the `{ data: { fieldName: ... } }` wrapping automatically.

### Example: Real-Time Counter

**Schema:**

```graphql
type Subscription {
  countdown(from: Int = 10): Int @resolver
}
```

**Resolver:**

```typescript
import { createResolvers, createSubscriptionHandler } from '@aexol/axolotl-core';
import { setTimeout as setTimeout$ } from 'node:timers/promises';

export default createResolvers({
  Subscription: {
    countdown: createSubscriptionHandler(async function* (input, { from }) {
      console.log(`Starting countdown from ${from}`);

      for (let i = from || 10; i >= 0; i--) {
        await setTimeout$(1000);
        yield i;
      }

      console.log('Countdown complete!');
    }),
  },
});
```

**GraphQL Query:**

```graphql
subscription {
  countdown(from: 5)
}
```

### Example: PubSub Pattern

```typescript
import { createResolvers, createSubscriptionHandler } from '@aexol/axolotl-core';

export default createResolvers({
  Mutation: {
    sendMessage: async ([, , ctx], { text }) => {
      const message = {
        id: crypto.randomUUID(),
        text,
        timestamp: new Date().toISOString(),
      };

      // Publish event
      await ctx.pubsub.publish('MESSAGE_ADDED', message);

      return message;
    },
  },

  Subscription: {
    messageAdded: createSubscriptionHandler(async function* (input) {
      const [, , ctx] = input;
      const channel = ctx.pubsub.subscribe('MESSAGE_ADDED');

      try {
        for await (const message of channel) {
          yield message;
        }
      } finally {
        // Cleanup on disconnect
        await channel.unsubscribe();
      }
    }),
  },
});
```

### Federated Subscriptions

In federated setups, each subscription field should only be defined in **one module**:

```typescript
// ✅ CORRECT: Define in one module only
// users/schema.graphql
type Subscription {
  userStatusChanged(userId: String!): UserStatus @resolver
}

// ❌ WRONG: Multiple modules defining the same subscription
// users/schema.graphql
type Subscription {
  statusChanged: Status @resolver
}

// todos/schema.graphql
type Subscription {
  statusChanged: Status @resolver  # Conflict!
}
```

If multiple modules try to define the same subscription field, only the first one encountered will be used.

---

## STEP 7: Server Configuration

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

## STEP 8: Micro-Federation (GraphQL Federation Patterns)

Micro-federation is one of Axolotl's most powerful features, allowing you to compose multiple GraphQL modules into a unified API while maintaining type safety and code organization.

### What is Micro-Federation?

Micro-federation in Axolotl is a modular architecture pattern where:

- Each domain (e.g., users, todos, products) has its own GraphQL schema and resolvers
- Schemas are automatically merged into a single supergraph at build time
- Each module maintains its own type safety with generated models
- Resolvers are intelligently merged at runtime to handle overlapping types

**Key Difference from Apollo Federation:** Axolotl's micro-federation is designed for **monorepo or single-project architectures** where all modules are built and deployed together, not for distributed microservices.

### When to Use Micro-Federation

**Good use cases:**

- Large monorepo applications with distinct domain modules
- Teams working on separate features within the same codebase
- Projects where you want to organize GraphQL code by business domain
- Applications that need to scale code organization without microservices complexity

**Not recommended for:**

- Distributed services that deploy independently (use Apollo Federation instead)
- Simple applications with only a few types and resolvers
- Projects where all types are tightly coupled

---

### Federation Configuration

**axolotl.json:**

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

---

### Federation Directory Structure

Recommended structure for a federated project:

```
project/
├── axolotl.json              # Main config with federation array
├── schema.graphql            # Generated supergraph (don't edit manually)
├── src/
│   ├── models.ts             # Generated supergraph models
│   ├── axolotl.ts           # Main Axolotl instance
│   ├── resolvers.ts         # Merged resolvers (calls mergeAxolotls)
│   ├── index.ts             # Server entry point
│   │
│   ├── users/               # Users domain module
│   │   ├── schema.graphql   # Users schema
│   │   ├── models.ts        # Generated from users schema
│   │   ├── axolotl.ts       # Users Axolotl instance
│   │   ├── db.ts            # Users data layer
│   │   └── resolvers/
│   │       ├── resolvers.ts       # Main users resolvers export
│   │       ├── Mutation/
│   │       │   ├── resolvers.ts
│   │       │   ├── login.ts
│   │       │   └── register.ts
│   │       └── Query/
│   │           ├── resolvers.ts
│   │           └── user.ts
│   │
│   └── todos/               # Todos domain module
│       ├── schema.graphql
│       ├── models.ts
│       ├── axolotl.ts
│       ├── db.ts
│       └── resolvers/
│           ├── resolvers.ts
│           ├── AuthorizedUserMutation/
│           ├── AuthorizedUserQuery/
│           └── TodoOps/
```

---

### Creating Submodule Schemas

Each module defines its own schema:

**src/users/schema.graphql:**

```graphql
type User {
  _id: String!
  username: String!
}

type Mutation {
  login(username: String!, password: String!): String! @resolver
  register(username: String!, password: String!): String! @resolver
}

type Query {
  user: AuthorizedUserQuery! @resolver
}

type AuthorizedUserQuery {
  me: User! @resolver
}

directive @resolver on FIELD_DEFINITION

schema {
  query: Query
  mutation: Mutation
}
```

**src/todos/schema.graphql:**

```graphql
type Todo {
  _id: String!
  content: String!
  done: Boolean
}

type AuthorizedUserMutation {
  createTodo(content: String!): String! @resolver
  todoOps(_id: String!): TodoOps! @resolver
}

type AuthorizedUserQuery {
  todos: [Todo!] @resolver
  todo(_id: String!): Todo! @resolver
}

type TodoOps {
  markDone: Boolean @resolver
}

directive @resolver on FIELD_DEFINITION

type Query {
  user: AuthorizedUserQuery @resolver
}

type Mutation {
  user: AuthorizedUserMutation @resolver
}

schema {
  query: Query
  mutation: Mutation
}
```

---

### Module Axolotl Instances

Each module needs its own `axolotl.ts` file to create type-safe resolver helpers:

**src/users/axolotl.ts:**

```typescript
import { Models } from '@/src/users/models.js';
import { Axolotl } from '@aexol/axolotl-core';
import { graphqlYogaAdapter } from '@aexol/axolotl-graphql-yoga';

export const { createResolvers, createDirectives, applyMiddleware } = Axolotl(graphqlYogaAdapter)<Models, unknown>();
```

**src/todos/axolotl.ts:**

```typescript
import { Models } from '@/src/todos/models.js';
import { Axolotl } from '@aexol/axolotl-core';
import { graphqlYogaAdapter } from '@aexol/axolotl-graphql-yoga';

export const { createResolvers, createDirectives, applyMiddleware } = Axolotl(graphqlYogaAdapter)<Models, unknown>();
```

---

### Schema Merging Rules

When you run `axolotl build`, schemas are merged using these rules:

**1. Types are merged by name:**

- If `User` type exists in multiple schemas, all fields are combined
- Fields with the same name **must have identical type signatures**
- If there's a conflict, the build fails with a detailed error

**Example - Types get merged:**

```graphql
# users/schema.graphql
type User {
  _id: String!
  username: String!
}

# todos/schema.graphql
type User {
  _id: String!
}

# Merged result in schema.graphql
type User {
  _id: String!
  username: String! # Field from users module
}
```

**2. Root types (Query, Mutation, Subscription) are automatically merged:**

```graphql
# users/schema.graphql
type Query {
  user: AuthorizedUserQuery! @resolver
}

# todos/schema.graphql
type Query {
  user: AuthorizedUserQuery @resolver
}

# Merged result - fields combined
type Query {
  user: AuthorizedUserQuery @resolver
}
```

---

### Resolver Merging with mergeAxolotls

The `mergeAxolotls` function intelligently merges resolvers:

**1. Non-overlapping resolvers are combined:**

```typescript
// users: { Mutation: { login: fn1 } }
// todos: { Mutation: { createTodo: fn2 } }
// Result: { Mutation: { login: fn1, createTodo: fn2 } }
```

**2. Overlapping resolvers are executed in parallel and results are deep-merged:**

```typescript
// users: { Query: { user: () => ({ username: "john" }) } }
// todos: { Query: { user: () => ({ todos: [...] }) } }
// Result: { Query: { user: () => ({ username: "john", todos: [...] }) } }
```

This allows multiple modules to contribute different fields to the same resolver!

**3. Subscriptions cannot be merged - only the first one is used:**

```typescript
// If multiple modules define the same subscription, only the first is used
// This is because subscriptions have a single event stream
```

**Module resolvers example:**

```typescript
// src/users/resolvers/resolvers.ts
import { createResolvers } from '../axolotl.js';
import Mutation from './Mutation/resolvers.js';
import Query from './Query/resolvers.js';
import AuthorizedUserQuery from './AuthorizedUserQuery/resolvers.js';

export default createResolvers({
  ...Mutation,
  ...Query,
  ...AuthorizedUserQuery,
});
```

```typescript
// src/users/resolvers/Mutation/login.ts
import { createResolvers } from '../../axolotl.js';
import { db } from '../../db.js';

export default createResolvers({
  Mutation: {
    login: async (_, { password, username }) => {
      const user = db.users.find((u) => u.username === username && u.password === password);
      return user?.token;
    },
  },
});
```

**Main resolvers (merge all modules):**

```typescript
// src/resolvers.ts
import { mergeAxolotls } from '@aexol/axolotl-core';
import todosResolvers from '@/src/todos/resolvers/resolvers.js';
import usersResolvers from '@/src/users/resolvers/resolvers.js';

export default mergeAxolotls(todosResolvers, usersResolvers);
```

---

### Type Generation Flow

```
1. Read axolotl.json
   ↓
2. For each federation entry:
   - Parse schema file
   - Generate models.ts with TypeScript types
   ↓
3. Merge all schemas using graphql-js-tree
   ↓
4. Write merged schema to root schema file
   ↓
5. Generate root models.ts from supergraph
   ↓
6. Each module uses its own models for type safety
```

---

### Advanced Federation Topics

#### Sharing Types Across Modules

When modules need to reference the same types, define them in each schema:

```graphql
# src/users/schema.graphql
type User {
  _id: String!
  username: String!
}
```

```graphql
# src/todos/schema.graphql
type User {
  _id: String! # Shared fields must match exactly
}

type Todo {
  _id: String!
  content: String!
  owner: User! # Reference the shared type
}
```

The schemas will be merged, and the `User` type will contain all fields from both definitions.

#### Cross-Module Dependencies

Modules can extend each other's types by defining resolvers for shared types:

```typescript
// src/todos/resolvers/Query/user.ts
import { createResolvers } from '@/src/axolotl.js';
import { db as usersDb } from '@/src/users/db.js';

// Todos module contributes to the Query.user resolver
export default createResolvers({
  Query: {
    user: async (input) => {
      const token = input[2].request.headers.get('token');
      const user = usersDb.users.find((u) => u.token === token);
      if (!user) throw new Error('Not authorized');
      return user;
    },
  },
});
```

When multiple modules implement the same resolver, their results are deep-merged automatically.

#### Custom Scalars in Federation

Define scalars in each module that uses them:

```graphql
# src/todos/schema.graphql
scalar Secret

type AuthorizedUserMutation {
  createTodo(content: String!, secret: Secret): String! @resolver
}
```

Scalar resolvers should be defined once in the main `axolotl.ts`:

```typescript
// src/axolotl.ts
import { Axolotl } from '@aexol/axolotl-core';
import { Models } from '@/src/models.js';

export const { adapter, createResolvers } = Axolotl(graphqlYogaAdapter)<
  Models<{ Secret: number }>, // Map custom scalar to TypeScript type
  unknown
>();
```

#### Subscriptions in Federation

Subscriptions work in federated setups, but each subscription field should only be defined in **one module**:

```typescript
// src/users/resolvers/Subscription/countdown.ts
import { createResolvers, createSubscriptionHandler } from '@aexol/axolotl-core';

export default createResolvers({
  Subscription: {
    countdown: createSubscriptionHandler(async function* (input, { from }) {
      for (let i = from ?? 3; i >= 0; i--) {
        yield i;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }),
  },
});
```

If multiple modules try to define the same subscription field, only the first one encountered will be used.

#### Directives Across Modules

Directives must be defined in each schema that uses them:

```graphql
directive @resolver on FIELD_DEFINITION
directive @auth(role: String!) on FIELD_DEFINITION
```

Directive implementations should be registered in each module's Axolotl instance that needs them.

---

### Federation Development Workflow

**Initial Setup:**

```bash
# Install dependencies
npm install

# Generate all models and merged schema
npx @aexol/axolotl build

# Generate resolver scaffolding (optional)
npx @aexol/axolotl resolvers
```

**When to Regenerate:**

Run `axolotl build` when you:

- Add or modify any schema file
- Add new types or fields
- Add or remove federation modules
- Change `axolotl.json` configuration

The CLI will regenerate:

1. Each submodule's `models.ts`
2. The merged `schema.graphql`
3. The root `models.ts`

---

### Federation Best Practices

**Module Organization:**

- Organize by business domain (users, products, orders)
- Keep related types in the same module
- Use consistent directory structure across modules
- Make modules as independent as possible

**Avoid:**

- Creating modules for every single type
- Mixing unrelated concerns in one module
- Creating circular dependencies between modules

**Naming Conventions for Shared Types:**

```graphql
# Good: Both modules use "User"
type User {
  _id: String!
}

# Bad: Different names for same concept
type UserAccount {
  _id: String!
}
type UserProfile {
  _id: String!
}
```

**Module-specific types - prefix with domain:**

```graphql
type TodoItem { ... }
type TodoFilter { ... }
```

**Performance Considerations:**

- **Parallel resolver execution:** When multiple modules implement the same resolver, they execute in parallel using `Promise.all()`. Be aware of database connection limits and rate limiting.
- **Deep merge overhead:** Results are deep-merged using object spreading. Keep resolver return values focused and avoid deeply nested objects when possible.
- **Use DataLoader** for batching database queries across modules.

---

### Federation Troubleshooting

#### Schema Merge Conflicts

**Error:** `Federation conflict on Node.field pattern: User.email`

**Cause:** The same field on the same type has different definitions across modules.

**Solution:** Ensure field types match exactly:

```graphql
# users/schema.graphql
type User {
  email: String! # Required
}

# profile/schema.graphql
type User {
  email: String # Optional - CONFLICT!
}
```

Fix by making them identical in both files.

#### Type Generation Failures

**Error:** `Cannot find module '@/src/users/models.js'`

**Solution:**

```bash
# Regenerate all models
npx @aexol/axolotl build

# Check your tsconfig.json has correct path mappings
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

#### Resolver Not Found

**Causes:**

- Resolver not exported from module
- Not included in `mergeAxolotls` call
- Schema and resolver names don't match

**Solution:**

```typescript
// Ensure resolver is exported
export default createResolvers({
  Query: {
    user: async () => { ... }  // Must match schema field name exactly
  }
});

// Ensure it's merged
import usersResolvers from './users/resolvers/resolvers.js';
export default mergeAxolotls(usersResolvers, ...otherResolvers);
```

#### Merged Resolver Returns Unexpected Data

**Issue:** Deep merge combines objects in unexpected ways.

**Solution:** Ensure resolvers return compatible object shapes. If modules return conflicting primitives, the last one wins. Use different field names to avoid conflicts.

---

### Axolotl vs Apollo Federation Comparison

| Feature                | Axolotl Micro-Federation | Apollo Federation            |
| ---------------------- | ------------------------ | ---------------------------- |
| **Deployment**         | Single service           | Multiple services            |
| **Schema Merging**     | Build-time               | Runtime with gateway         |
| **Type Splitting**     | Automatic deep merge     | Explicit `@key` directives   |
| **Resolver Execution** | Parallel within process  | Cross-service HTTP calls     |
| **Performance**        | Fast (in-process)        | Network overhead             |
| **Complexity**         | Simple config            | Gateway + federation service |
| **Use Case**           | Monorepo/single app      | Distributed microservices    |
| **Independence**       | Shared codebase          | Fully independent services   |

---

### Running the Federation Example

The repository includes a complete federated example:

```bash
# Navigate to the example
cd examples/yoga-federated

# Install dependencies (if not already done at root)
npm install

# Generate models
npm run models

# Run in development mode
npm run dev
```

Visit `http://localhost:4102/graphql` and try these operations:

```graphql
# Register a user
mutation Register {
  register(username: "user", password: "password")
}

# Login (returns token)
mutation Login {
  login(username: "user", password: "password")
}

# Set the token in headers: { "token": "your-token-here" }

# Create a todo
mutation CreateTodo {
  user {
    createTodo(content: "Learn Axolotl Federation")
  }
}

# Query merged data (comes from both users and todos modules!)
query MyData {
  user {
    me {
      _id
      username
    }
    todos {
      _id
      content
      done
    }
  }
}
```

---

## STEP 9: Server-Side Rendering (SSR) with Vite

This project features full SSR using Express + Vite for optimal performance and SEO.

### SSR Architecture

```
Request Flow:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Browser   │───▶│   Express   │───▶│    Vite     │
└─────────────┘    └─────────────┘    └─────────────┘
                          │                   │
                          ▼                   ▼
                   ┌─────────────┐    ┌─────────────┐
                   │   GraphQL   │    │  React SSR  │
                   │    /graphql │    │  Renderer   │
                   └─────────────┘    └─────────────┘
```

### Server Entry Point (src/index.ts)

```typescript
import fs from 'node:fs/promises';
import express from 'express';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import { adapter } from '@/src/axolotl.js';
import resolvers from '@/src/resolvers.js';
import directives from './directives.js';

const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  const port = parseInt(process.env.PORT || '4102', 10);

  // Create Axolotl/Yoga GraphQL instance
  const { yoga } = adapter({ resolvers, directives }, { yoga: { graphqlEndpoint: '/graphql', graphiql: true } });

  // Mount GraphQL
  app.use('/graphql', yoga);

  // Development: Vite dev server with HMR
  // Production: Static file serving
  let vite: ViteDevServer | undefined;
  if (!isProduction) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    app.use(compression());
    app.use(sirv('./dist/client'));
  }

  // SSR handler for all routes
  app.use('*all', async (req, res) => {
    const url = req.originalUrl;
    let template, render;

    if (!isProduction) {
      template = await fs.readFile('./frontend/index.html', 'utf-8');
      template = await vite!.transformIndexHtml(url, template);
      render = (await vite!.ssrLoadModule('/src/entry-server.tsx')).render;
    } else {
      template = cachedProductionTemplate;
      render = (await import('./dist/server/entry-server.js')).render;
    }

    const rendered = await render(url);
    const html = template
      .replace('<!--app-head-->', rendered.head ?? '')
      .replace('<!--app-html-->', rendered.html ?? '');

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  });

  app.listen(port);
}
```

### Frontend Entry Points

**Client Entry (frontend/src/entry-client.tsx):**

```typescript
import { hydrateRoot } from 'react-dom/client';
import App from './App';

hydrateRoot(document.getElementById('root')!, <App />);
```

**Server Entry (frontend/src/entry-server.tsx):**

```typescript
import { renderToString } from 'react-dom/server';
import App from './App';

export function render(url: string) {
  const html = renderToString(<App />);
  return { html };
}
```

### SSR-Safe Patterns

When writing frontend code for SSR:

```typescript
// SSR-safe storage access
const getStorage = () => {
  if (typeof window === 'undefined') {
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  }
  return localStorage;
};

// Use in Zustand persist middleware
persist(storeCreator, {
  storage: createJSONStorage(() => getStorage()),
});
```

---

## STEP 10: Prisma Database Integration

This project includes Prisma schema for PostgreSQL (ready to use with Docker).

### Prisma Schema (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String
  token     String?
  todos     Todo[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Todo {
  id        String   @id @default(cuid())
  content   String
  done      Boolean  @default(false)
  owner     User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  ownerId   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Setup with Docker

```bash
# Start PostgreSQL
docker-compose up -d

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# View data in Prisma Studio
npx prisma studio
```

### Environment Configuration

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/axolotl?schema=public"
```

**Note:** The current example uses in-memory storage (`db.ts` files). To use Prisma:

1. Import the generated Prisma client
2. Replace in-memory operations with Prisma queries

---

## STEP 11: AI Chat Integration (Vercel AI SDK)

This project includes AI chat functionality via GraphQL subscriptions using Vercel AI SDK.

### AI Provider Setup (src/ai/providers.ts)

```typescript
import { createOpenAI } from '@ai-sdk/openai';

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const gpt4o = openai('gpt-4o');
export const gpt4oMini = openai('gpt-4o-mini');
export const gpt35Turbo = openai('gpt-3.5-turbo');
```

### AI Chat Subscription Resolver

```typescript
import { createSubscriptionHandler } from '@aexol/axolotl-core';
import { createResolvers } from '../../axolotl.js';
import { streamText, CoreMessage } from 'ai';
import { gpt4oMini } from '../../../ai/index.js';

export default createResolvers({
  Subscription: {
    aiChat: createSubscriptionHandler(async function* (_, { messages, system }) {
      if (!process.env.OPENAI_API_KEY) {
        yield { content: 'Error: OPENAI_API_KEY is not configured', done: true };
        return;
      }

      const result = streamText({
        model: gpt4oMini,
        messages: messages as CoreMessage[],
        system: system || 'You are a helpful assistant.',
      });

      for await (const chunk of result.textStream) {
        yield { content: chunk, done: false };
      }
      yield { content: '', done: true };
    }),
  },
});
```

### GraphQL Schema for AI Chat

```graphql
input ChatMessage {
  role: String!
  content: String!
}

type AIChatResponse {
  content: String!
  done: Boolean!
}

type Subscription {
  aiChat(messages: [ChatMessage!]!, system: String): AIChatResponse! @resolver
}
```

### Using AI Chat

```graphql
subscription AIChat {
  aiChat(
    messages: [{ role: "user", content: "Hello! What is Axolotl?" }]
    system: "You are an expert on GraphQL frameworks"
  ) {
    content
    done
  }
}
```

### Environment Configuration

```bash
# .env
OPENAI_API_KEY=sk-your-api-key-here
```

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

````

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
````

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
