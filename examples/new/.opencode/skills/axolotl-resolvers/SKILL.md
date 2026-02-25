---
name: axolotl-resolvers
description: Writing Axolotl resolvers - signatures, destructuring patterns, context access, typing, and organized resolver file structure
---

## Resolver Signature

```typescript
(input, args) => ReturnType;
// input = [source, args, context]
```

### Destructuring Patterns

```typescript
// Context only (most common)
me: async ([, , context]) => getUserById(context.authUser!._id);

// Context with args
createPost: async ([, , context], { title, content }) => createPost(context.authUser!._id, title, content);

// Source — nested type resolvers only (e.g., TodoOps receives a Todo)
markDone: async ([source, , context]) => updateTodo((source as PrismaTodo).id);
```

---

## Gateway Auth Pattern

- Auth module owns `Query.user` / `Mutation.user`. Domain modules define fields on `AuthorizedUserQuery` / `AuthorizedUserMutation`.
- `AuthorizedUserQuery` / `AuthorizedUserMutation` have a `_: String` placeholder — GraphQL requires ≥1 field. Domain modules add real fields via same type name; `axolotl build` merges.

```typescript
// Gateway resolver (auth module) — checks context, returns {}
export default createResolvers({
  Query: {
    user: async ([, , context]) => {
      if (!context.authUser) {
        throw new GraphQLError('Not authorized', { extensions: { code: 'UNAUTHORIZED' } });
      }
      return {}; // auth data lives on context, not source
    },
  },
});
```

```typescript
// Protected resolver (domain module) — reads auth from context
// context.authUser! is safe here: gateway already verified it exists
export default createResolvers({
  AuthorizedUserQuery: {
    posts: async ([, , context]) => {
      return prisma.post.findMany({ where: { authorId: context.authUser!._id } });
    },
    me: async ([, , context]) => {
      return { _id: context.authUser!._id, email: context.authUser!.email };
    },
  },
});
```

---

## Resource-Level Authorization

**Every resolver MUST verify the user owns/has access to the resource via `context.authUser!._id`.**

```typescript
// ✅ CORRECT — scoped to authenticated user
deleteNote: async ([, , context], { id }) => {
  await prisma.note.findFirstOrThrow({
    where: { id, userId: context.authUser!._id },
  });
  return prisma.note.delete({ where: { id } });
},

// ❌ WRONG — any authenticated user can delete any note
deleteNote: async ([, , context], { id }) => {
  return prisma.note.delete({ where: { id } });
},
```

---

## Source Typing (Nested Resolvers Only)

Auth data → use `context.authUser`, never source. Source typing is for **nested resolvers** where parent returns a domain object:

```typescript
import type { Todo as PrismaTodo } from '@/src/prisma/generated/prisma/index.js';

export default createResolvers({
  TodoOps: {
    markDone: async ([source, , context]) => {
      const todo = source as PrismaTodo;
      return prisma.todo.update({ where: { id: todo.id }, data: { done: true } });
    },
  },
});
```

---

## Prisma Typing

Import from `@/src/prisma/generated/prisma/index.js` — **never `as any`**:

```typescript
import type { Visit as PrismaVisit } from '@/src/prisma/generated/prisma/index.js';
const mapVisit = (v: PrismaVisit) => ({ _id: v.id, protocolType: v.protocolType });
```

- `@@map()` renames DB table only — accessor is always camelCase: `prisma.overtimeRecord`
- `prisma as any` is forbidden

### Prisma Enums & Input Types

```typescript
import { StaffRole, CommissionType } from '@/src/prisma/generated/prisma/index.js';

const GQL_TO_PRISMA_ROLE: Record<string, StaffRole> = {
  ADMIN: StaffRole.ADMIN,
  STAFF: StaffRole.STAFF,
};

await prisma.commission.create({ data: { type: CommissionType.VISIT } });

// Generated input types are already typed — no casting needed:
data.firstName = input.firstName ?? null; // ✅ typed as string | undefined | null
(input as any).firstName; // ❌ never
```

---

## File Structure

```
backend/src/
├── resolvers.ts                  # mergeAxolotls(auth, users, ...)
└── modules/posts/resolvers/
    ├── resolvers.ts              # createResolvers({ ...Mutation, ...AuthorizedUserQuery })
    ├── Mutation/createPost.ts
    └── AuthorizedUserQuery/posts.ts
```

Scaffold: `cd backend && npx @aexol/axolotl resolvers` (preserves existing).

---

## Quick Rules

- Return `{}` from gateway resolvers. Auth module owns `Query.user` / `Mutation.user` exclusively.
- Domain resolvers: `context.authUser!`, never source. Every resource access verifies ownership via `context.authUser!._id`.
- Never `as any` or `as AppContext` — context is auto-typed. Always `createResolvers()` from `axolotl.ts`.
