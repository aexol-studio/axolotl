---
name: axolotl-schema
description: Schema-first development, @resolver directive, models generation, resolver boilerplate scaffolding, CLI commands, and inspect tool
---

## GraphQL Schema (schema.graphql)

**Example:**

```graphql
scalar Secret

type User {
  _id: String!
  email: String!
}

type Query {
  user: AuthorizedUserQuery @resolver
  hello: String!
}

type Mutation {
  login(email: String!, password: String!): String! @resolver
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
- After modifying schema, ALWAYS run: `cd backend && npx @aexol/axolotl build`

---

## Models Generation

**Command:**

```bash
cd backend && npx @aexol/axolotl build
# Or with custom directory:
npx @aexol/axolotl build --cwd path/to/project
```

**What it does:**

- Reads `backend/schema.graphql`
- Generates TypeScript types in `backend/src/models.ts`
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
    email: { args: Record<string, never> };
  };
  ['Query']: {
    hello: { args: Record<string, never> };
    user: { args: Record<string, never> };
  };
  ['Mutation']: {
    login: {
      args: {
        email: string;
        password: string;
      };
    };
  };
};
```

---

## Generate Resolver Boilerplate (Optional but Recommended)

**Command:**

```bash
cd backend && npx @aexol/axolotl resolvers
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
  login(email: String!, password: String!): String! @resolver
}
```

The command generates:

```
backend/src/
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

- Starting a new project with many resolvers
- Adding new resolver fields to existing schema
- Want organized, maintainable resolver structure
- Working with federated schemas (generates for each module)

**Workflow:**

1. Add `@resolver` directives to schema fields
2. Run `cd backend && npx @aexol/axolotl build` to update types
3. Run `cd backend && npx @aexol/axolotl resolvers` to scaffold structure
4. Implement TODO sections in generated resolver files
5. Import and use `resolvers/resolvers.ts` in your server

**Note for Federated Projects:**

The command automatically detects federation in `backend/axolotl.json` and generates resolver structures for each federated schema in the appropriate directories.

---

## CLI Commands Reference

```bash
# Create new Axolotl project with Yoga
npx @aexol/axolotl create-yoga my-project

# Generate models from schema
cd backend && npx @aexol/axolotl build

# Generate models with custom directory
npx @aexol/axolotl build --cwd path/to/project

# Generate resolver boilerplate from @resolver directives
cd backend && npx @aexol/axolotl resolvers

# Inspect resolvers (find unimplemented @resolver fields)
cd backend && npx @aexol/axolotl inspect -s schema.graphql -r lib/resolvers.js
```

### Inspect Command

The `inspect` command identifies which resolvers marked with `@resolver` directive are not yet implemented:

```bash
cd backend && npx @aexol/axolotl inspect -s ./schema.graphql -r ./lib/resolvers.js
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

**Tip:** Use `cd backend && npx @aexol/axolotl resolvers` to generate stubs, then use `inspect` to track implementation progress.

---

## Quick Reference

| Task               | Command/Code                                                              |
| ------------------ | ------------------------------------------------------------------------- |
| Initialize project | `npx @aexol/axolotl create-yoga <name>`                                   |
| Generate types     | `cd backend && npx @aexol/axolotl build`                                  |
| Scaffold resolvers | `cd backend && npx @aexol/axolotl resolvers`                              |
| Inspect resolvers  | `cd backend && npx @aexol/axolotl inspect -s schema.graphql -r resolvers` |
