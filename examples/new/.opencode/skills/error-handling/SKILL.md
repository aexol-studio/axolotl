---
name: error-handling
description: GraphQL error extraction, global toast handling via QueryCache/MutationCache, auth error auto-logout, and per-hook success toast patterns
---

## Error Extraction (`frontend/src/api/errors.ts`)

Errors are typed via `GraphQLErrorEntry` interface (in `errors.ts`) — no `as any`:

- `extensions.code` is `string | undefined`
- `getGraphQLErrorCode(error)` extracts the error code from extensions

```typescript
import { getGraphQLErrorMessage, getGraphQLErrorCode, isAuthError } from '../api';

getGraphQLErrorMessage(error); // → errors[0].message, or "An unexpected error occurred"
getGraphQLErrorCode(error); // → errors[0].extensions.code, or null
isAuthError(error); // → true if code is UNAUTHORIZED or FORBIDDEN
```

Never access `extensions.originalError` — dev-only, breaks in production.

## Global Handlers (`frontend/src/lib/queryClient.ts`)

```typescript
import { queryKeys } from './queryKeys.js';

let isHandlingAuthError = false;

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: async (error) => {
      if (typeof window === 'undefined') return;
      if (isAuthError(error) && !isHandlingAuthError) {
        isHandlingAuthError = true;

        toast.info('Session expired. Please log in again.');

        await queryClient.cancelQueries();
        mutation()({ user: { logout: true } }).catch(() => {}); // best-effort (non-awaited)

        queryClient.setQueryData(queryKeys.me, null);
        queryClient.clear();
        window.location.href = '/login';
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (isAuthError(error)) return; // QueryCache handles it
      toast.error(getGraphQLErrorMessage(error));
    },
  }),
});
```

- Auth error flow: SSR guard → de-dupe guard → cancel queries → best-effort non-awaited logout mutation → clear auth/cache state → `window.location.href = '/login'`
- Non-auth mutation error → `toast.error()` with extracted message
- **Do NOT add `onError` to individual hooks** — the global handler covers it

Auth errors must suppress retries — add to `defaultOptions`:

```typescript
defaultOptions: {
  queries: {
    retry: (failureCount, error) => {
      if (isAuthError(error)) return false;
      return failureCount < 1;
    },
  },
},
```

## Per-Hook Pattern (success only)

```typescript
const createMutation = useMutation({
  mutationFn: async (input) => {
    /* ... */
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.items });
    toast.success('Item created!');
    // ⛔ no onError here
  },
});

// For form flow — return boolean so forms know success/failure
const submit = async (input) => {
  try {
    await createMutation.mutateAsync(input);
    return true;
  } catch {
    return false;
  } // error toast already shown globally
};
```

## Error Code Conventions

- `UNAUTHORIZED` — missing/invalid auth token or session
- `FORBIDDEN` — valid session, insufficient permission
- `INVALID_CREDENTIALS` — wrong email/password on login
- `EMAIL_EXISTS` — registration with existing email
- `INVALID_INPUT` — input fails validation rules
- `NOT_FOUND` — requested resource doesn't exist

## Backend Throw Pattern

```typescript
import { GraphQLError } from 'graphql'; // NOT from graphql-yoga

throw new GraphQLError('Invalid email or password', {
  extensions: { code: 'INVALID_CREDENTIALS' },
});
// Plain Error → masked to "Unexpected error." on client (use for internal crashes only)
```

## Error Masking

GraphQL Yoga has error masking enabled by default — **DO NOT disable it**. Only `GraphQLError` messages reach the client; plain `Error` messages are masked to "Unexpected error." This is intentional for security.
