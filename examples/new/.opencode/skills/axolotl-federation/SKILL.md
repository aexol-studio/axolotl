---
name: axolotl-federation
description: Axolotl micro-federation architecture - config, schema merging, mergeAxolotls, cross-module dependencies, best practices, and troubleshooting
---

## Micro-Federation

- Each domain has its own `schema.graphql`, `models.ts`, `axolotl.ts`, and `resolvers/`
- Schemas are merged into a single supergraph at build time (`axolotl build`)
- Each module has its own generated `models.ts` for local type safety
- All modules are built and deployed together (not distributed microservices)

---

## Module Adapter Rule

Modules **MUST** use `graphqlYogaAdapter`. Only the root `src/axolotl.ts` uses `graphqlYogaWithContextAdapter`. Context is initialized once by root and flows automatically to all resolvers.

```typescript
// ✅ CORRECT — every module's axolotl.ts
import { Axolotl } from '@aexol/axolotl-core';
import { graphqlYogaAdapter } from '@aexol/axolotl-graphql-yoga';
import { Models } from '@/src/modules/posts/models.js';
export const { createResolvers } = Axolotl(graphqlYogaAdapter)<Models, unknown>();

// ✅ CORRECT — root src/axolotl.ts only
const yogaAdapter = graphqlYogaWithContextAdapter<AppContext>(buildContext);
export const { createResolvers, adapter } = Axolotl(yogaAdapter)<Models, Scalars>();
```

---

## Schema Merging Rules

- **Types merged by name** — fields from all modules combined; conflicting field types cause build failure
- **Root types auto-merged** — `Query`, `Mutation`, `Subscription` fields combined across all modules
- **Shared field definitions must match exactly** across modules

---

## Sharing Types Across Modules

Modules can declare the same type — fields are merged at build time:

```graphql
# src/modules/users/schema.graphql
type User {
  _id: String!
  email: String!
}

# src/modules/posts/schema.graphql
type User {
  _id: String! # shared fields must match exactly
}

type Post {
  owner: User! # reference the shared type
}
# → merged User has both _id and email
```

---

## `mergeAxolotls` Behavior

- **Non-overlapping resolvers** — combined into one resolver map
- **Overlapping resolvers** — executed in parallel, results deep-merged
- **Subscriptions** — first-wins; define each subscription field in exactly ONE module

```typescript
// src/resolvers.ts
import { mergeAxolotls } from '@aexol/axolotl-core';
export default mergeAxolotls(authResolvers, usersResolvers /*, postsResolvers, ... */);
```

---

## Auth Gateway Pattern

- Auth module (`src/modules/auth/`) exclusively owns `Query.user` and `Mutation.user` gateway resolvers
- Domain modules define fields on `AuthorizedUserQuery` / `AuthorizedUserMutation` — **never** on `Query.user` / `Mutation.user`
- Duplicating gateway resolvers in domain modules causes merge conflicts and breaks auth

---

## Cross-Module Dependencies

Domain resolvers access the authenticated user via `[source]` — the object returned by the auth gateway:

```typescript
// posts module — AuthorizedUserQuery resolver
export default createResolvers({
  AuthorizedUserQuery: {
    posts: async ([source]) => {
      const user = source as { _id: string };
      return prisma.post.findMany({ where: { authorId: user._id } });
    },
  },
});
```

---

## When to Run `axolotl build`

Run `cd backend && npx @aexol/axolotl build` after:

- Adding or modifying any `schema.graphql` file
- Adding/removing federation modules from `axolotl.json`
- Any type or field changes

---

## Custom Scalars

Declare scalar in each module schema that uses it. Resolve it once in root `axolotl.ts`:

```graphql
# module schema
scalar Secret
```

```typescript
// root axolotl.ts — map scalar to TS type
Axolotl(yogaAdapter)<Models<{ Secret: number }>, Scalars>();
```

See `axolotl-server` skill for `createScalars` implementation.
