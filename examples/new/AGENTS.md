# Axolotl Starter Boilerplate - LLM Integration Guide

## Overview

This is a **starter boilerplate** for building Axolotl GraphQL applications. It provides:

- Type-safe GraphQL backend with Axolotl
- SSR-enabled React frontend with Vite
- Zustand state management
- Prisma database integration
- AI Chat subscription with Vercel AI SDK
- Zeus type-safe GraphQL client generation

This boilerplate is intentionally minimal - extend it to build your application.

## File Structure

```
examples/new/
├── axolotl.json          # Configuration (no federation)
├── schema.graphql        # GraphQL schema (simple: hello, echo, countdown, aiChat)
├── prisma/
│   └── schema.prisma     # Prisma database schema
├── src/
│   ├── axolotl.ts        # Framework initialization
│   ├── models.ts         # Auto-generated types (DO NOT EDIT)
│   ├── resolvers.ts      # All resolver implementations
│   ├── index.ts          # Express + Vite SSR server (port 4103)
│   ├── db.ts             # Prisma client initialization
│   └── ai/
│       ├── index.ts      # AI chat handler
│       └── providers.ts  # AI provider configuration
├── frontend/             # React SSR frontend
│   ├── AGENTS.md         # Frontend-specific guide
│   └── src/
│       ├── api/          # GraphQL client layer
│       ├── stores/       # Zustand stores
│       ├── zeus/         # Auto-generated Zeus client
│       ├── App.tsx       # Main React component
│       ├── entry-client.tsx  # Client entry
│       └── entry-server.tsx  # SSR entry
└── mobile/               # Mobile Zeus client output
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
7. **Import from axolotl.ts** - never from @aexol/axolotl-core directly in resolver files
8. **Use createResolvers()** for ALL resolver definitions

---

## STEP 1: Understanding axolotl.json

The `axolotl.json` configuration file for this boilerplate:

```json
{
  "schema": "schema.graphql",
  "models": "src/models.ts",
  "zeus": [
    {
      "generationPath": "frontend/src",
      "esModule": true
    },
    {
      "generationPath": "mobile/"
    }
  ]
}
```

**Key Points:**

- No federation - this is a simple single-schema setup
- Zeus generates clients for both `frontend/src` and `mobile/`
- `esModule: true` for the frontend (Vite/React)

---

## STEP 2: GraphQL Schema (schema.graphql)

The boilerplate includes a simple schema:

```graphql
type Query {
  hello: String!
}

type Mutation {
  echo(message: String!): String!
}

input AIChatMessage {
  role: String!
  content: String!
}

type AIChatChunk {
  content: String!
  done: Boolean!
}

type Subscription {
  countdown(from: Int): Int @resolver
  aiChat(messages: [AIChatMessage!]!, system: String): AIChatChunk! @resolver
}

directive @resolver on FIELD_DEFINITION

schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
```

**Included Features:**

- `Query.hello` - Simple hello world query
- `Mutation.echo` - Echo back a message
- `Subscription.countdown` - Real-time countdown example
- `Subscription.aiChat` - AI chat streaming with Vercel AI SDK

---

## STEP 3: Models Generation

**Command:**

```bash
npx @aexol/axolotl build
```

**What it does:**

- Reads `schema.graphql`
- Generates TypeScript types in `src/models.ts`
- Generates Zeus client in `frontend/src/zeus/` and `mobile/`

---

## STEP 4: The axolotl.ts File

**File: src/axolotl.ts**

This boilerplate uses a simple setup without custom context:

```typescript
import { Models, Scalars } from '@/src/models.js';
import { Axolotl } from '@aexol/axolotl-core';
import { graphqlYogaAdapter } from '@aexol/axolotl-graphql-yoga';

export const { createResolvers, adapter } = Axolotl(graphqlYogaAdapter)<Models, Scalars>();
```

**To add custom context** (e.g., authentication), modify to:

```typescript
import { graphqlYogaWithContextAdapter } from '@aexol/axolotl-graphql-yoga';
import { YogaInitialContext } from 'graphql-yoga';

type AppContext = YogaInitialContext & {
  userId: string | null;
};

async function buildContext(initial: YogaInitialContext): Promise<AppContext> {
  const token = initial.request.headers.get('authorization')?.replace('Bearer ', '');
  return {
    ...initial,
    userId: token ? await verifyToken(token) : null,
  };
}

export const { createResolvers, adapter } = Axolotl(graphqlYogaWithContextAdapter<AppContext>(buildContext))<
  Models,
  Scalars
>();
```

---

## STEP 5: Writing Resolvers

**File: src/resolvers.ts**

All resolvers are in a single file for simplicity:

```typescript
import { createResolvers, createSubscriptionHandler } from '@aexol/axolotl-core';
import { setTimeout as setTimeout$ } from 'node:timers/promises';
import { aiChat } from './ai/index.js';

export default createResolvers({
  Query: {
    hello: () => 'Hello from Axolotl!',
  },
  Mutation: {
    echo: (_, { message }) => message,
  },
  Subscription: {
    countdown: createSubscriptionHandler(async function* (_, { from }) {
      for (let i = from ?? 3; i >= 0; i--) {
        yield i;
        await setTimeout$(1000);
      }
    }),
    aiChat: createSubscriptionHandler(aiChat),
  },
});
```

### Resolver Signature

```typescript
(input, args) => ReturnType;
```

Where:

- `input[0]` = **source** (parent value)
- `input[1]` = **args** (field arguments)
- `input[2]` = **context** (request context)
- `args` = convenience second parameter

### Common Patterns

```typescript
// Access context only
createResolvers({
  Query: {
    me: async ([, , context]) => {
      return getUserById(context.userId);
    },
  },
});

// Use convenience args parameter
createResolvers({
  Mutation: {
    createTodo: async ([, , context], { content }) => {
      return createTodo(content, context.userId);
    },
  },
});
```

---

## STEP 6: Subscriptions

**CRITICAL:** All subscription resolvers **MUST** use `createSubscriptionHandler` from `@aexol/axolotl-core`.

### Countdown Example

```typescript
import { createSubscriptionHandler } from '@aexol/axolotl-core';
import { setTimeout as setTimeout$ } from 'node:timers/promises';

createResolvers({
  Subscription: {
    countdown: createSubscriptionHandler(async function* (input, { from }) {
      for (let i = from || 10; i >= 0; i--) {
        await setTimeout$(1000);
        yield i;
      }
    }),
  },
});
```

### AI Chat Example

The boilerplate includes an AI chat subscription using Vercel AI SDK:

```typescript
// src/ai/index.ts
import { streamText } from 'ai';
import { getProvider } from './providers.js';

export async function* aiChat(
  _: unknown,
  { messages, system }: { messages: Array<{ role: string; content: string }>; system?: string },
) {
  const result = streamText({
    model: getProvider(),
    messages: messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    system,
  });

  for await (const chunk of result.textStream) {
    yield { content: chunk, done: false };
  }
  yield { content: '', done: true };
}
```

---

## STEP 7: SSR Server Configuration

**File: src/index.ts**

The server uses Express with Vite SSR:

```typescript
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { adapter } from './axolotl.js';
import resolvers from './resolvers.js';

const PORT = 4103;

async function createServer() {
  const app = express();

  // GraphQL endpoint
  const { yoga } = adapter({ resolvers }, { yoga: { graphiql: true } });
  app.use('/graphql', yoga);

  // Vite SSR setup
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  app.use(vite.middlewares);

  // SSR handler
  app.use('*', async (req, res) => {
    // ... SSR rendering logic
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`GraphiQL: http://localhost:${PORT}/graphql`);
  });
}

createServer();
```

**Port:** 4103 (configurable)

---

## STEP 8: Prisma Database

**File: prisma/schema.prisma**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Example {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  name      String
}
```

**Setup commands:**

```bash
# Generate Prisma client
npx prisma generate

# Create database and run migrations
npx prisma migrate dev --name init

# Open Prisma Studio
npx prisma studio
```

**Using Prisma in resolvers:**

```typescript
import { prisma } from './db.js';

createResolvers({
  Query: {
    examples: async () => {
      return prisma.example.findMany();
    },
  },
  Mutation: {
    createExample: async (_, { name }) => {
      return prisma.example.create({ data: { name } });
    },
  },
});
```

---

## Common Commands

```bash
# Install dependencies
npm install

# Generate models and Zeus client
npx @aexol/axolotl build

# Run in development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

---

## Extending the Boilerplate

### Adding Authentication

1. Add user schema to `prisma/schema.prisma`
2. Update `schema.graphql` with auth types
3. Add context with authentication in `axolotl.ts`
4. Create auth resolvers

### Adding New Features

1. Update `schema.graphql` with new types
2. Run `npx @aexol/axolotl build`
3. Add resolvers to `src/resolvers.ts` (or create separate files)
4. Update frontend to use new queries/mutations

### Organizing Resolvers

For larger projects, split resolvers into separate files:

```
src/
├── resolvers/
│   ├── Query/
│   │   └── resolvers.ts
│   ├── Mutation/
│   │   └── resolvers.ts
│   └── resolvers.ts  # Merges all
```

Use `mergeAxolotls()` to combine:

```typescript
import { mergeAxolotls } from '@aexol/axolotl-core';
import QueryResolvers from './Query/resolvers.js';
import MutationResolvers from './Mutation/resolvers.js';

export default mergeAxolotls(QueryResolvers, MutationResolvers);
```

---

## Quick Reference

| Task                | Command/Code                                          |
| ------------------- | ----------------------------------------------------- |
| Generate types      | `npx @aexol/axolotl build`                            |
| Run dev server      | `npm run dev`                                         |
| Access GraphiQL     | `http://localhost:4103/graphql`                       |
| Create resolvers    | `createResolvers({ Query: {...} })`                   |
| Access context      | `([, , context])` - third in tuple                    |
| Access parent       | `([source])` - first in tuple                         |
| Merge resolvers     | `mergeAxolotls(resolvers1, resolvers2)`               |
| Create subscription | `createSubscriptionHandler(async function* () {...})` |
| Prisma generate     | `npx prisma generate`                                 |
| Prisma migrate      | `npx prisma migrate dev`                              |

---

This boilerplate provides a minimal starting point. See `examples/yoga-federated/` for a more complete example with federation, authentication, and a full todo application.
