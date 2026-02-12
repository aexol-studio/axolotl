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
    posts: async ([source]) => {
      // Access parent data
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
  login(username: String!, password: String!): String! @resolver # ← Defined by users module
  register(username: String!, password: String!): String! @resolver # ← Defined by users module
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

The gateway validates the token and returns the authenticated user. That returned object becomes `source` for every child resolver.

```typescript
export const Query = createResolvers({
  Query: {
    user: async (input) => {
      const token = input[2].request.headers.get('token');
      if (!token) throw new GraphQLError('Not authorized', { extensions: { code: 'UNAUTHORIZED' } });
      const user = await prisma.user.findFirst({ where: { token } });
      if (!user) throw new GraphQLError('Not authorized', { extensions: { code: 'UNAUTHORIZED' } });
      // Returned value becomes `source` for all child resolvers
      return { _id: user.id, username: user.username };
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
      const user = source as { _id: string; username: string };
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
2. Run `cd backend && axolotl build` to regenerate types
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
