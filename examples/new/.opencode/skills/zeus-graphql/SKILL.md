---
name: zeus-graphql
description: Zeus type-safe GraphQL client with React Query integration - useQuery/useMutation + Zeus queryFn, selectors, cache invalidation, API layer architecture
---

## Architecture

```
React Query (state/cache) -> Zeus api layer (type-safe) -> GraphQL server
```

- `api/client.ts`, `api/query.ts`, `api/mutation.ts` — type-safe GraphQL communication
- React Query manages caching, loading/error states, invalidation
- Components use `useQuery`/`useMutation` which call Zeus internally

---

## API Layer

```typescript
// api/client.ts
import { Chain } from '../zeus/index';
export const createChain = () =>
  Chain('/graphql', { headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin' });

// api/query.ts
import { createChain } from './client';
export const query = () => createChain()('query');

// api/mutation.ts
import { createChain } from './client';
export const mutation = () => createChain()('mutation');
```

---

## Selectors

```typescript
import { Selector, type FromSelector } from '../zeus/index.js';

const postSelector = Selector('Post')({ _id: true, title: true, content: true, published: true });
type PostType = FromSelector<typeof postSelector, 'Post'>; // derive type — never duplicate manually
```

- **1 file only** → define locally
- **2+ files** → define in `api/selectors.ts`, re-export from `api/index.ts`

---

## `$` Variables

Use `$` when values come from user input or props:

```typescript
import { $ } from '../zeus/index';

await mutation()(
  { login: [{ email: $('email', 'String!'), password: $('password', 'String!') }, true] },
  { variables: { email, password } },
);
```

---

## useQuery + Zeus

> ⚠️ Use `isLoading`, NOT `isPending`. `isPending` is `true` when `enabled: false`, causing permanent loading states. `isLoading` (`isPending && isFetching`) only fires during actual fetches.

```typescript
import { useQuery } from '@tanstack/react-query';
import { query } from '../api';
import { useAuthStore } from '../stores';

const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

const { data, isLoading, error } = useQuery({
  queryKey: ['posts'],
  queryFn: async () => {
    const data = await query()({ user: { posts: { _id: true, title: true } } });
    return data.user?.posts ?? [];
  },
  enabled: isAuthenticated,
});
```

---

## useMutation + Zeus

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mutation } from '../api';

const queryClient = useQueryClient();

const createPost = useMutation({
  mutationFn: async (input: { title: string; content: string }) => {
    await mutation()({ user: { createPost: [input, true] } });
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  },
});
```

---

## Cache Invalidation

- After mutations: `queryClient.invalidateQueries({ queryKey: ['posts'] })`
- From subscription callbacks: same `invalidateQueries` call
- On logout: `queryClient.clear()` (clears ALL cache — security)

---

## Key Rules

1. **ALWAYS use React Query** in components — never `useState`/`useEffect` fetching
2. **Zeus `query()`/`mutation()`** go inside `queryFn`/`mutationFn` only
3. **Use `enabled`** for conditional queries (e.g., `enabled: isAuthenticated`)
4. **ALWAYS define Selectors** for reusable query shapes
5. **ALWAYS use `FromSelector`** to derive types — never duplicate backend types manually
6. **Selector in 1 file** → local; **2+ files** → `api/selectors.ts`
7. **Use `$`** for GraphQL variables from user input or props
8. **One hook per domain** — owns queries, mutations, loading/error state; components stay presentational
9. **Import from `../api`** — never directly from Zeus
