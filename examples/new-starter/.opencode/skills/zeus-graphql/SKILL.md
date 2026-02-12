---
name: zeus-graphql
description: Zeus type-safe GraphQL client with React Query integration - useQuery/useMutation + Zeus queryFn, selectors, cache invalidation, API layer architecture
---

## Architecture Overview

The data-fetching architecture is layered:

```
React Query (state/cache management)
  -> Zeus api layer (type-safe fetching)
    -> GraphQL server
```

- **Zeus api layer** (`api/client.ts`, `api/query.ts`, `api/mutation.ts`) handles type-safe GraphQL communication
- **React Query** (`@tanstack/react-query`) manages server state, caching, loading/error states, and cache invalidation
- Components use React Query hooks (`useQuery`/`useMutation`) which call Zeus internally

---

## GraphQL API Layer with Zeus (Foundation)

### Client Setup (api/client.ts)

```typescript
import { Chain } from '../zeus/index';
import { useAuthStore } from '../stores/authStore';

// Create authenticated chain - reads token from Zustand store
export const createChain = () => {
  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['token'] = token;
  }
  return Chain('/graphql', { headers });
};
```

### Query/Mutation Helpers (api/query.ts, api/mutation.ts)

```typescript
// api/query.ts
import { createChain } from './client';
export const query = () => createChain()('query');

// api/mutation.ts
import { createChain } from './client';
export const mutation = () => createChain()('mutation');
```

### Direct Usage (for non-component contexts)

```typescript
import { query, mutation } from '../api';

// Fetching data
const data = await query()({
  user: {
    me: { _id: true, username: true },
  },
});

// Mutations
await mutation()({
  user: {
    updateUser: [{ username: 'new-name' }, true],
  },
});

// Login
const data = await mutation()({
  login: [{ username, password }, true],
});
```

---

## Advanced Zeus Patterns

### Using Selectors

Selectors define reusable query shapes and derive TypeScript types:

```typescript
import { Selector, type FromSelector } from '../zeus/index.js';

// Define selector
const postSelector = Selector('Post')({
  _id: true,
  title: true,
  content: true,
  published: true,
});

// Derive type from selector (instead of manual type definition)
type PostType = FromSelector<typeof postSelector, 'Post'>;

// Use in query
const data = await query()({
  user: { posts: postSelector },
});
```

#### Selector Placement Rule

- **Used in 1 file only** → define locally in that file
- **Used in 2+ files** → define in `api/selectors.ts` and re-export from `api/index.ts`

Shared selectors file (`api/selectors.ts`):

```typescript
import { Selector, type FromSelector } from '../zeus/index.js';

export const postSelector = Selector('Post')({
  _id: true,
  title: true,
  content: true,
  published: true,
});
export type PostType = FromSelector<typeof postSelector, 'Post'>;
```

Re-export from `api/index.ts`:

```typescript
export { postSelector, type PostType } from './selectors.js';
```

### GraphQL Variables with `$`

Use `$` for parameterized queries:

```typescript
import { $ } from '../zeus/index';

// With variables
const result = await mutation()(
  {
    login: [
      {
        username: $('username', 'String!'),
        password: $('password', 'String!'),
      },
      true,
    ],
  },
  {
    variables: { username: 'john', password: 'secret' },
  },
);
```

---

## React Query Integration

React Query wraps the Zeus api layer to provide caching, automatic loading/error states, and cache invalidation.

### Setup

**QueryClient configuration** (`lib/queryClient.ts`):

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

**Provider setup** in `App.tsx`:

```typescript
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/queryClient';

// Wrap app with QueryClientProvider
<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Pattern: useQuery + Zeus

> ⚠️ **Use `isLoading`, not `isPending`** for UI loading states. `isPending` is `true` when query is disabled (`enabled: false`), causing permanent loading states. `isLoading` (`isPending && isFetching`) is only `true` during actual fetches.

Zeus `query()` is used inside React Query's `queryFn`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores';
import { query } from '../api';

const token = useAuthStore((s) => s.token);

const { data, isLoading, error } = useQuery({
  queryKey: ['posts'],
  queryFn: async () => {
    const data = await query()({
      user: { posts: { _id: true, title: true, content: true, published: true } },
    });
    return data.user?.posts ?? [];
  },
  enabled: !!token, // only fetch when authenticated
});
```

### Pattern: useMutation + Zeus

Zeus `mutation()` is used inside React Query's `mutationFn`, with cache invalidation on success:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mutation } from '../api';

const queryClient = useQueryClient();

const createPostMutation = useMutation({
  mutationFn: async (input: { title: string; content: string }) => {
    await mutation()({
      user: { createPost: [input, true] },
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  },
});

// Use with .mutateAsync() for imperative flows
const createPost = async (input: { title: string; content: string }) => {
  try {
    await createPostMutation.mutateAsync(input);
    return true;
  } catch {
    return false;
  }
};
```

### Query Key Conventions

Query keys are simple string arrays:

| Query Key   | Purpose                    |
| ----------- | -------------------------- |
| `['posts']` | Post list data             |
| `['me']`    | Current authenticated user |

For more complex apps, consider a key factory pattern (e.g., `postKeys.all()`, `postKeys.detail(id)`).

### Cache Invalidation Patterns

- **After mutations:** `queryClient.invalidateQueries({ queryKey: ['posts'] })`
- **From subscriptions:** Same invalidation in subscription callbacks
- **On logout:** `queryClient.clear()` (clears ALL cache -- security measure)

**Subscription -> invalidation bridge:**

```typescript
const queryClient = useQueryClient();

usePostSubscription({
  ownerId: user?._id ?? null,
  onPostCreated: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  onPostUpdated: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
});
```

### Conditional Queries

Use `enabled` to prevent queries from running until preconditions are met:

```typescript
const { data } = useQuery({
  queryKey: ['me'],
  queryFn: async () => {
    /* ... */
  },
  enabled: !!token, // don't fetch until token exists
  retry: (failureCount, error) => {
    if (error instanceof Error && error.message.includes('Unauthorized')) return false;
    return failureCount < 1;
  },
});
```

### Error Aggregation Pattern

Aggregate errors from query + multiple mutations into a single value:

```typescript
const error = queryError?.message ?? loginMutation.error?.message ?? registerMutation.error?.message ?? null;
```

---

## Key Rules

1. **ALWAYS use React Query** (`useQuery`/`useMutation`) for data fetching in components -- never manual `useState`/`useEffect` fetching
2. **Use Zeus `query()`/`mutation()`** inside React Query's `queryFn`/`mutationFn`
3. **Use `enabled`** option for conditional queries (e.g., `enabled: !!token`)
4. **Invalidate cache** after mutations with `queryClient.invalidateQueries()`
5. **Clear cache on logout** with `queryClient.clear()`
6. **ALWAYS use Zeus** for GraphQL communication -- never write raw GraphQL queries
7. **Use the api/ layer** -- import from `../api` not directly from Zeus
8. **ALWAYS define Selectors** for reusable query shapes
9. **ALWAYS use `FromSelector`** to derive TypeScript types from selectors
10. **NEVER manually duplicate backend types** -- derive them from selectors
11. **Selector used in 1 file** → keep local; **used in 2+ files** → put in `api/selectors.ts`
12. **Use `$` function** for GraphQL variables when values come from user input or props
13. **One hook per domain** — `useAuth` for authentication, `usePosts` for post operations. Each hook owns its queries, mutations, error aggregation, and loading states. Keep components presentational — all data logic lives in hooks

---

## Quick Reference

| Task                    | Code                                                             |
| ----------------------- | ---------------------------------------------------------------- |
| Create query            | `query()({ user: { posts: { _id: true } } })`                    |
| Create mutation         | `mutation()({ login: [{ username, password }, true] })`          |
| Mutation with args      | `mutation()({ field: [{ arg: value }, selector] })`              |
| Return scalar directly  | `field: [{ args }, true]`                                        |
| Fetch with React Query  | `useQuery({ queryKey: ['key'], queryFn: () => query()({...}) })` |
| Mutate with React Query | `useMutation({ mutationFn: (args) => mutation()({...}) })`       |
| Invalidate cache        | `queryClient.invalidateQueries({ queryKey: ['key'] })`           |
| Conditional query       | `useQuery({ ..., enabled: !!token })`                            |
| Define selector         | `const sel = Selector('Post')({ _id: true, ... })`               |
| Derive type             | `type T = FromSelector<typeof sel, 'Post'>`                      |
| Clear all cache         | `queryClient.clear()`                                            |

---

## Troubleshooting

### Type errors after schema changes

**Solution:** Regenerate Zeus by running `cd backend && npx @aexol/axolotl build`

### Zeus files not found

> **Zeus Configuration:** See `AGENTS.md` → **Understanding axolotl.json** for the Zeus generation config. The `zeus` array in `axolotl.json` defines output paths for generated Zeus client files.

**Solution:** Verify `backend/axolotl.json` contains a `zeus` array pointing to your frontend source directory, then run `cd backend && npx @aexol/axolotl build` to regenerate.
