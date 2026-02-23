---
name: axolotl-resolvers
description: Writing Axolotl resolvers - signatures, destructuring patterns, parent/source access, typing, and organized resolver file structure
---

## Resolver Signature

```typescript
(input, args) => ReturnType;
// input = [source, args, context]
// input[0] = source (parent), input[1] = args, input[2] = context
// args also provided as second param for convenience
```

### Destructuring Patterns

```typescript
// Context only
me: async ([, , context]) => getUserById(context.userId);

// Source and context
posts: async ([source, , context]) => getPostsByUser((source as { _id: string })._id);

// Convenience args parameter
createPost: async ([, , context], { title, content }) => createPost(title, content);

// Underscores for unused
me: async ([_, __, context]) => getUserById(context.userId);
```

---

## Gateway Auth Pattern

**RULE:** Auth module owns `Query.user` / `Mutation.user`. Domain modules define fields on `AuthorizedUserQuery` / `AuthorizedUserMutation`. **Never** define gateway resolvers in domain modules.

### `_: String` Placeholder

The auth module declares `AuthorizedUserQuery` / `AuthorizedUserMutation` with a `_: String` placeholder — GraphQL requires at least one field per type. Domain modules add real fields by declaring the same type name in their own schema. `axolotl build` merges all fields.

### Gateway Resolver (auth module)

```typescript
export const Query = createResolvers({
  Query: {
    user: async (input) => {
      const cookieHeader = input[2].request.headers.get('cookie');
      const tokenHeader = input[2].request.headers.get('token');
      const authResult = await verifyAuth(cookieHeader, tokenHeader);
      return authResult; // { _id: string, email: string } — becomes `source` for child resolvers
    },
  },
});
```

### Protected Resolver (domain module)

```typescript
export const AuthorizedUserQuery = createResolvers({
  AuthorizedUserQuery: {
    posts: async ([source]) => {
      const user = source as { _id: string; email: string };
      return prisma.post.findMany({ where: { authorId: user._id } });
    },
    me: async ([source]) => source, // already have user from gateway
  },
});
```

---

## Typing the Parent

```typescript
type UserSource = { _id: string; email: string };

export default createResolvers({
  AuthorizedUserQuery: {
    me: ([source]) => {
      const src = source as UserSource;
      return { _id: src._id, email: src.email };
    },
  },
});
```

---

## Prisma Typing

Import Prisma-generated types from `@/src/prisma/generated/prisma/index.js` — **never use `any`**:

```typescript
import type { Visit as PrismaVisit } from '@/src/prisma/generated/prisma/index.js';

const mapVisit = (v: PrismaVisit) => ({
  _id: v.id,
  protocolType: v.protocolType,
});
```

- `@@map()` only renames the DB table — TypeScript accessor is always camelCase model name (`prisma.overtimeRecord`, not `prisma.overtime_record`)
- Never cast the Prisma client: `prisma as any` is forbidden

### Prisma Enum Mapping

Import Prisma enums and cast — never use `as any`:

```typescript
import { StaffRole, CommissionType } from '@/src/prisma/generated/prisma/index.js';

// Map GraphQL string → Prisma enum
const GQL_TO_PRISMA_ROLE: Record<string, StaffRole> = {
  ADMIN: StaffRole.ADMIN,
  STAFF: StaffRole.STAFF,
};
const prismaRole = GQL_TO_PRISMA_ROLE[graphqlRole]; // typed as StaffRole

// Or use enum member directly
await prisma.commission.create({ data: { type: CommissionType.VISIT } });
```

### Generated Input Types

`models.ts` fields are directly accessible — no casting needed:

```typescript
// ✅ input.firstName is typed as string | undefined | null
data.firstName = input.firstName ?? null;

// ❌ never do this — the field is already typed
(input as any).firstName;
```

---

## Resolver File Structure

```
backend/src/
├── resolvers.ts                          # mergeAxolotls(authResolvers, usersResolvers, ...)
└── modules/
    └── posts/
        └── resolvers/
            ├── resolvers.ts              # createResolvers({ ...Mutation, ...AuthorizedUserQuery })
            ├── Mutation/
            │   └── createPost.ts
            └── AuthorizedUserQuery/
                └── posts.ts
```

Run `cd backend && npx @aexol/axolotl resolvers` to scaffold this structure. Existing implementations are preserved.

---

## Key Rules

1. **Return `{}`** from parent resolvers to enable nested resolvers
2. Auth module owns `Query.user` / `Mutation.user` — domain modules never define these
3. Domain modules add fields to `AuthorizedUserQuery` / `AuthorizedUserMutation`
4. **Never use `any`** — import Prisma types or use type assertions
5. Always use `createResolvers()` — import from `axolotl.ts`, not `@aexol/axolotl-core` directly
