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

### Gateway Authentication Pattern

Schema-level auth enforcement where `Query.user` / `Mutation.user` act as authentication gateways — protected resolvers are unreachable without passing through them first.

#### Why It Works

- The GraphQL type system enforces authorization structurally
- Protected resolvers under `AuthorizedUserQuery` / `AuthorizedUserMutation` are literally unreachable without passing through the gateway resolver first
- No middleware, no decorators, no `@auth` directives needed — the schema itself is the guard
- If the gateway throws, the entire subtree is blocked

#### Schema Structure

```graphql
# PUBLIC - accessible without authentication
type Query {
  user: AuthorizedUserQuery! @resolver # ← Gateway (auth check here)
}

type Mutation {
  user: AuthorizedUserMutation! @resolver # ← Gateway (auth check here)
  login(username: String!, password: String!): String! @resolver # ← Public
  register(username: String!, password: String!): String! @resolver # ← Public
}

# PROTECTED - only reachable if gateway resolver succeeds
type AuthorizedUserQuery {
  me: User! @resolver
  todos: [Todo!] @resolver
}

type AuthorizedUserMutation {
  createTodo(content: String!): String! @resolver
  changePassword(newPassword: String!): Boolean @resolver
}
```

- `Query` / `Mutation` root fields = **public namespace**
- `AuthorizedUserQuery` / `AuthorizedUserMutation` = **protected namespace**

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
    todos: async ([source]) => {
      const user = source as { _id: string; username: string };
      return await prisma.todo.findMany({ where: { ownerId: user._id } });
    },
    me: async ([source]) => {
      return source; // Already have the user from gateway
    },
  },
});
```

#### Adding New Protected Fields

1. Add the field to `AuthorizedUserQuery` or `AuthorizedUserMutation` in the schema
2. Run `axolotl build` to regenerate types
3. Implement the resolver — destructure `[source]` to access the authenticated user. Auth is already enforced by the gateway.

#### Alternative Auth Approaches

- **Context-level auth** — validate token once in context builder, access `context.userId` everywhere. See the `axolotl-server` skill.
- **Directive-based auth** — `@auth` directive on fields. See the `axolotl-server` skill.
- **Gateway pattern is preferred** when you want schema-enforced protection without custom context setup.

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
