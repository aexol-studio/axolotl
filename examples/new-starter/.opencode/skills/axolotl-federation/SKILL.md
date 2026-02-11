---
name: axolotl-federation
description: Axolotl micro-federation architecture - config, schema merging, mergeAxolotls, cross-module dependencies, best practices, and troubleshooting
---

## Micro-Federation (GraphQL Federation Patterns)

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

**backend/axolotl.json:**

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
├── backend/
│   ├── axolotl.json              # Main config with federation array
│   ├── schema.graphql            # Generated supergraph (don't edit manually)
│   ├── src/
│   │   ├── models.ts             # Generated supergraph models
│   │   ├── axolotl.ts           # Main Axolotl instance
│   │   ├── resolvers.ts         # Merged resolvers (calls mergeAxolotls)
│   │   ├── index.ts             # Server entry point
│   │   │
│   │   ├── users/               # Users domain module
│   │   │   ├── schema.graphql   # Users schema
│   │   │   ├── models.ts        # Generated from users schema
│   │   │   ├── axolotl.ts       # Users Axolotl instance
│   │   │   ├── db.ts            # Users data layer
│   │   │   └── resolvers/
│   │   │       ├── resolvers.ts       # Main users resolvers export
│   │   │       ├── Mutation/
│   │   │       │   ├── resolvers.ts
│   │   │       │   ├── login.ts
│   │   │       │   └── register.ts
│   │   │       └── Query/
│   │   │           ├── resolvers.ts
│   │   │           └── user.ts
│   │   │
│   │   └── todos/               # Todos domain module
│   │       ├── schema.graphql
│   │       ├── models.ts
│   │       ├── axolotl.ts
│   │       ├── db.ts
│   │       └── resolvers/
│   │           ├── resolvers.ts
│   │           ├── AuthorizedUserMutation/
│   │           ├── AuthorizedUserQuery/
│   │           └── TodoOps/
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

When you run `cd backend && axolotl build`, schemas are merged using these rules:

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
1. Read backend/axolotl.json
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
      // Gateway auth — validates token, returns user.
      // See axolotl-resolvers skill for full pattern.
      const token = input[2].request.headers.get('token');
      const user = usersDb.users.find((u) => u.token === token);
      if (!user) throw new Error('Not authorized');
      return user;
    },
  },
});
```

> **Note:** The complete gateway authentication pattern (schema design, why it works, implementation) is documented in the **axolotl-resolvers** skill.

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
cd backend && npx @aexol/axolotl build

# Generate resolver scaffolding (optional)
cd backend && npx @aexol/axolotl resolvers
```

**When to Regenerate:**

Run `cd backend && axolotl build` when you:

- Add or modify any schema file
- Add new types or fields
- Add or remove federation modules
- Change `backend/axolotl.json` configuration

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
cd backend && npx @aexol/axolotl build

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

Visit `http://localhost:4002/graphql` and try these operations:

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
