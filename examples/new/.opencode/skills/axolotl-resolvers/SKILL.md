---
name: axolotl-resolvers
description: Writing Axolotl resolvers - signatures, destructuring patterns, parent/source access, typing, and organized resolver file structure
---

## Writing Resolvers

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
    login: async ([source, args, context], { email, password }) => {
      //            ↑ Destructure tuple    ↑ Convenience args parameter
      const result = await authenticateUser(email, password);
      return result;
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
    posts: async ([source, , context]) => {
      const src = source as { _id: string };
      return getPostsByUserId(src._id);
    },
  },
});

// Pattern 3: Use convenience args parameter
createResolvers({
  Mutation: {
    createPost: async ([, , context], { title, content }) => {
      return createPost(title, content, context.userId);
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
  posts: [Post!] @resolver
}

// Resolvers
createResolvers({
  Query: {
    user: async ([, , context]) => {
      const cookieHeader = context.request.headers.get('cookie');
      const tokenHeader = context.request.headers.get('token');
      const authResult = await verifyAuth(cookieHeader, tokenHeader);
      // authResult becomes the SOURCE for AuthorizedUserQuery resolvers
      return authResult; // { _id: string, email: string }
    },
  },
  AuthorizedUserQuery: {
    me: ([source]) => {
      const src = source as { _id: string; email: string };
      return src;
    },
    posts: async ([source]) => {
      const src = source as { _id: string };
      return getPostsByUserId(src._id);
    },
  },
});
```

### Gateway Authentication Pattern

Schema-level auth enforcement where `Query.user` / `Mutation.user` act as authentication gateways — protected resolvers are unreachable without passing through them first.

> **CRITICAL RULE:** Domain modules define resolvers for `AuthorizedUserQuery` and `AuthorizedUserMutation` types. They **NEVER** define resolvers for `Query.user` or `Mutation.user` — those gateway resolvers are owned exclusively by the **auth module** (`src/modules/auth/`). Duplicating gateway resolvers in domain modules causes merge conflicts and breaks authentication.

#### Why It Works

- The GraphQL type system enforces authorization structurally
- Protected resolvers under `AuthorizedUserQuery` / `AuthorizedUserMutation` are literally unreachable without passing through the gateway resolver first
- No middleware, no decorators, no `@auth` directives needed — the schema itself is the guard
- If the gateway throws, the entire subtree is blocked

#### Schema Structure

The merged schema (output of `axolotl build`) combines fields from all modules:

```graphql
# MERGED SCHEMA (combines auth + users + domain modules)

# PUBLIC - accessible without authentication
type Query {
  user: AuthorizedUserQuery @resolver # ← Defined by auth module
}

type Mutation {
  user: AuthorizedUserMutation @resolver # ← Defined by auth module
  login(email: String!, password: String!): String! @resolver # ← Defined by users module
  register(email: String!, password: String!): String! @resolver # ← Defined by users module
}

# PROTECTED - only reachable if gateway resolver succeeds
type AuthorizedUserQuery {
  _: String # ← Placeholder from auth module
  me: User! @resolver # ← Added by users module
  posts: [Post!] @resolver # ← Added by posts module (example)
}

type AuthorizedUserMutation {
  _: String # ← Placeholder from auth module
  changePassword(newPassword: String!): Boolean @resolver # ← Added by users module
  createPost(title: String!, content: String!): String! @resolver # ← Added by posts module (example)
}
```

> Each module only defines the fields it owns. `axolotl build` merges them into this unified schema.

- `Query` / `Mutation` root fields = **public namespace**
- `AuthorizedUserQuery` / `AuthorizedUserMutation` = **protected namespace**

#### The `_: String` Placeholder

In the **auth module's** schema, `AuthorizedUserQuery` and `AuthorizedUserMutation` are defined with a single placeholder field:

```graphql
# src/modules/auth/schema.graphql
type AuthorizedUserQuery {
  _: String
}

type AuthorizedUserMutation {
  _: String
}
```

GraphQL requires at least one field per object type. The `_: String` field serves as that placeholder. **Domain modules add their real fields** (e.g., `me`, `posts`, `createPost`) by declaring the same type name in their own schema files. At build time, Axolotl's schema merger combines all fields from all modules into the final type. The `_` placeholder is harmless — it simply exists so the auth module's schema is valid on its own.

#### Gateway Resolver

The gateway verifies authentication via `verifyAuth()` (cookie/token → JWT verification → session check) and returns the authenticated user identity. That returned object becomes `source` for every child resolver.

```typescript
export const Query = createResolvers({
  Query: {
    user: async (input) => {
      const cookieHeader = input[2].request.headers.get('cookie');
      const tokenHeader = input[2].request.headers.get('token');
      const authResult = await verifyAuth(cookieHeader, tokenHeader);
      // Returned value becomes `source` for all child resolvers
      return authResult; // { _id: string, email: string }
    },
  },
});
```

#### Protected Resolvers

Child resolvers destructure `[source]` to access the authenticated user — auth is already enforced by the gateway.

```typescript
export const AuthorizedUserQuery = createResolvers({
  AuthorizedUserQuery: {
    posts: async ([source]) => {
      const user = source as { _id: string; email: string };
      return await prisma.post.findMany({ where: { authorId: user._id } });
    },
    me: async ([source]) => {
      return source; // Already have the user from gateway
    },
  },
});
```

#### Adding New Protected Fields

1. Add the field to `AuthorizedUserQuery` or `AuthorizedUserMutation` **in your domain module's `schema.graphql`** file (NOT in the auth module). Axolotl's build step automatically merges it into the unified type.
2. Run `cd backend && npx @aexol/axolotl build` to regenerate types
3. Implement the resolver in your domain module — destructure `[source]` to access the authenticated user. Auth is already enforced by the gateway.

Example: To add a `posts` field to `AuthorizedUserQuery`, add it in `src/modules/posts/schema.graphql`:

```graphql
type AuthorizedUserQuery {
  posts: [Post!] @resolver
}
```

Do **not** add it to `src/modules/auth/schema.graphql`.

#### Alternative Auth Approaches

- **Context-level auth** — validate token once in context builder, access `context.userId` everywhere. See the `axolotl-server` skill.
- **Directive-based auth** — `@auth` directive on fields. See the `axolotl-server` skill.
- **Gateway pattern is preferred** when you want schema-enforced protection without custom context setup.

> **Rule Summary:**
>
> - Auth module (`src/modules/auth/`) → owns `Query.user` and `Mutation.user` gateway resolvers
> - Domain modules → define fields on `AuthorizedUserQuery` / `AuthorizedUserMutation` types, and implement resolvers for those fields
> - Domain modules **NEVER** define `Query.user` or `Mutation.user` resolvers

> **Multi-module setup:** For details on how the gateway pattern works across federated modules (schema merging, `mergeAxolotls`, cross-module type sharing), see the `axolotl-federation` skill.

### Typing the Parent (Two Methods)

**Method 1: Type Assertion (Simple)**

```typescript
type UserSource = {
  _id: string;
  email: string;
};

export default createResolvers({
  AuthorizedUserQuery: {
    me: ([source]) => {
      const src = source as UserSource;
      return {
        _id: src._id,
        email: src.email,
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

### Typing Prisma Query Results in Resolvers

When writing mapper functions that convert Prisma results to GraphQL shapes, **always import Prisma-generated types** instead of using `any`.

Prisma generates TypeScript types at the path defined in `schema.prisma` (`generator client { output = "./generated/prisma" }`). Import them directly:

> **Prerequisite:** These types only exist after running `cd backend && npx prisma generate`. Always run this after modifying `schema.prisma` — otherwise imports from `@/src/prisma/generated/prisma/index.js` will fail with "module not found".

```typescript
// ✅ Import Prisma-generated types
import type {
  StaffProfile as PrismaStaffProfile,
  WorkSchedule as PrismaWorkSchedule,
  Visit as PrismaVisit,
} from '@/src/prisma/generated/prisma/index.js';

// ✅ Use them in mapper functions — no `any` needed
const mapVisit = (v: PrismaVisit) => ({
  _id: v.id,
  protocolType: v.protocolType,
  // all fields are typed
});

const mapStaffProfile = (sp: PrismaStaffProfile & { clinicAssignments: { clinicId: string }[] }) => ({
  _id: sp.id,
  firstName: sp.firstName ?? null,
  // ...
});
```

**❌ NEVER use `any` for Prisma mapper parameters:**

```typescript
// ❌ WRONG
const mapVisit = (v: any) => ({ ... })
const mapStaffProfile = (sp: any) => ({ ... })
```

### Prisma Model Accessor Names (`@@map()` rule)

The `@@map()` decorator in Prisma schema only changes the **database table name**, NOT the TypeScript client property. The TypeScript accessor is always the **camelCase of the model name**:

| Prisma Schema                                        | DB Table           | TypeScript Accessor     |
| ---------------------------------------------------- | ------------------ | ----------------------- |
| `model OvertimeRecord { @@map("overtime_records") }` | `overtime_records` | `prisma.overtimeRecord` |
| `model SurveyResponse { @@map("survey_responses") }` | `survey_responses` | `prisma.surveyResponse` |
| `model StaffProfile { @@map("staff_profiles") }`     | `staff_profiles`   | `prisma.staffProfile`   |

**❌ NEVER cast the entire Prisma client to `any`:**

```typescript
// ❌ WRONG — all models are already accessible with full types
const db = prisma as any;
db.overtimeRecord.findMany(...)

// ✅ CORRECT — use prisma directly
prisma.overtimeRecord.findMany(...)
prisma.surveyResponse.aggregate(...)
```

### Prisma Enum ↔ GraphQL Enum Mapping

When mapping GraphQL enum strings to Prisma enum values, import the Prisma enum and cast specifically:

```typescript
import { StaffRole, CommissionType } from '@/src/prisma/generated/prisma/index.js';

// ✅ CORRECT — typed Record guarantees the value is a StaffRole
const GQL_TO_PRISMA_ROLE: Record<string, StaffRole> = {
  VETERINARIAN: StaffRole.VET,
  TECHNICIAN: StaffRole.TECHNICIAN,
};
const prismaRole = GQL_TO_PRISMA_ROLE[input.role as string]; // StaffRole

// ✅ For literal enum values in data objects:
type: CommissionType.VISIT,  // use the enum member directly

// ❌ WRONG
role: prismaRole as any
type: 'VISIT' as any
```

### Trusting Generated Input Types from `models.ts`

The auto-generated `models.ts` uses complex generic syntax but the optional input fields are directly accessible — no casting needed:

```typescript
// models.ts (generated):
export interface CreateStaffProfileInput<S extends {...}> {
  firstName?: string | undefined | null;
  lastName?: string | undefined | null;
  // ...
}

// ✅ CORRECT — just use the fields
data.firstName = input.firstName ?? null;
if (input.firstName !== undefined) data.firstName = input.firstName;

// ❌ WRONG — unnecessary, hides type errors
data.firstName = (input as any).firstName ?? null;
if ((input as any).firstName !== undefined) data.firstName = (input as any).firstName;
```

### Organized Resolver Structure (Recommended)

```typescript
// backend/src/resolvers/Query/resolvers.ts
import { createResolvers } from '../axolotl.js';
import user from './user.js';

export default createResolvers({
  Query: {
    ...user.Query,
  },
});

// backend/src/resolvers/Query/user.ts
import { createResolvers } from '../axolotl.js';

export default createResolvers({
  Query: {
    user: async ([, , context]) => {
      // Return object to enable nested resolvers
      return {};
    },
  },
});

// backend/src/resolvers.ts (main entry)
import { mergeAxolotls } from '@aexol/axolotl-core';
import QueryResolvers from '@/src/resolvers/Query/resolvers.js';
import MutationResolvers from '@/src/resolvers/Mutation/resolvers.js';

export default mergeAxolotls(QueryResolvers, MutationResolvers);
```

> **Tip:** This exact structure is auto-generated by the CLI. Run `cd backend && npx @aexol/axolotl resolvers` to scaffold resolver files for all `@resolver`-marked schema fields. Existing resolver implementations are preserved — only new files and aggregator imports are added. See the `axolotl-schema` skill for full details.

### Key Points

- Arguments are automatically typed from schema
- Return types must match schema definitions
- For nested resolvers, return an empty object `{}` in parent resolver
- Always use async functions (best practice)

### Resolver Patterns Cheat Sheet

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
