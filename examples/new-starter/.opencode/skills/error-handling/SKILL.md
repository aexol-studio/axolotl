---
name: error-handling
description: GraphQL error extraction, global toast handling via QueryCache/MutationCache, auth error auto-logout, and per-hook success toast patterns
---

## How Errors Flow (GraphQLError vs Error)

GraphQL Yoga has **error masking enabled by default** — DO NOT disable it.

| Backend throws                                      | Yoga behavior  | Client sees           | Use for            |
| --------------------------------------------------- | -------------- | --------------------- | ------------------ |
| `new GraphQLError('msg', { extensions: { code } })` | Passes through | Actual message + code | User-facing errors |
| `new Error('msg')`                                  | **Masks it**   | `"Unexpected error."` | Internal crashes   |

The frontend reads `errors[0].message` directly. If it says `"Unexpected error."`, the backend used a plain `Error` (intentionally hidden).

---

## Backend: Throw Patterns

Import `GraphQLError` from `'graphql'` (NOT `graphql-yoga`). Always include `extensions.code`:

```typescript
import { GraphQLError } from 'graphql';

// User-facing — passes through to client
throw new GraphQLError('Invalid username or password', {
  extensions: { code: 'INVALID_CREDENTIALS' },
});

// Internal crash — masked, client sees "Unexpected error."
throw new Error('Database connection failed');
```

### Error code vocabulary

| Code                  | When to use                             |
| --------------------- | --------------------------------------- |
| `UNAUTHORIZED`        | Missing or invalid auth token           |
| `FORBIDDEN`           | Valid token but insufficient permission |
| `INVALID_CREDENTIALS` | Wrong username/password on login        |
| `USER_EXISTS`         | Registration with existing username     |
| `NOT_FOUND`           | Requested resource doesn't exist        |
| `VALIDATION_ERROR`    | Input fails validation rules            |

---

## Frontend: Error Utilities (`frontend/src/api/errors.ts`)

### `getGraphQLErrorMessage(error)`

Extracts `errors[0].message` from Zeus `GraphQLError` responses. Returns `"An unexpected error occurred"` for masked/empty messages.

```typescript
import { getGraphQLErrorMessage } from '../api';

const message = getGraphQLErrorMessage(error);
// "Invalid username or password" — if backend used GraphQLError
// "An unexpected error occurred" — if backend used plain Error (masked)
```

**Never access `extensions.originalError`** — it's dev-only and breaks in production. Always use `errors[0].message` or this utility.

### `isAuthError(error)`

Detects auth errors by checking `extensions.code` (`UNAUTHORIZED` / `FORBIDDEN`), with message fallback.

```typescript
import { isAuthError } from '../api';
// Used by global handlers — you rarely need this directly
```

---

## Global Error Handling (`frontend/src/lib/queryClient.ts`)

The `QueryClient` handles errors automatically. **You do NOT need `onError` in individual hooks.**

```typescript
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (isAuthError(error)) {
        toast.info('Session expired. Please log in again.');
        useAuthStore.getState().logout();
        queryClient.clear();
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (isAuthError(error)) return; // QueryCache handles it
      toast.error(getGraphQLErrorMessage(error));
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (isAuthError(error)) return false;
        return failureCount < 1;
      },
    },
  },
});
```

| Scenario                        | What happens automatically             |
| ------------------------------- | -------------------------------------- |
| Auth error (any query/mutation) | Toast info + logout + clear cache      |
| Non-auth mutation error         | `toast.error()` with extracted message |
| Auth error retry                | Never retries                          |

---

## Per-Hook: Success Toasts Only

Error toasts are global. Only add **success toasts** in `onSuccess`, and use `mutateAsync` + try/catch for form flow:

```typescript
const createMutation = useMutation({
  mutationFn: async (content: string) => {
    /* ... */
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
    toast.success('Todo created!');
  },
  // ⛔ No onError — global handler covers it
});

// Wrapper for form flow control
const create = async (content: string) => {
  try {
    await createMutation.mutateAsync(content);
    return true;
  } catch {
    return false; // Error toast already shown globally
  }
};
```

For optional inline error display, aggregate with `getGraphQLErrorMessage`:

```typescript
const error = queryError ? getGraphQLErrorMessage(queryError) : null;
const clearError = () => createMutation.reset();
```

---

## Checklist

**Backend:**

- [ ] `GraphQLError` from `'graphql'` for all user-facing errors
- [ ] `extensions.code` on every `GraphQLError`
- [ ] Plain `Error` only for internal crashes you want masked

**Frontend:**

- [ ] `toast.success()` in each mutation's `onSuccess`
- [ ] No `onError` on any mutation or query
- [ ] `getGraphQLErrorMessage()` for any inline error display
- [ ] `mutation.reset()` exposed as `clearError` when aggregating errors
- [ ] `try/catch` around `.mutateAsync()` returning boolean for form control

---

## Quick Reference

| Task                      | Code                                                              |
| ------------------------- | ----------------------------------------------------------------- |
| Backend user-facing error | `throw new GraphQLError('msg', { extensions: { code: 'CODE' } })` |
| Import GraphQLError       | `import { GraphQLError } from 'graphql'`                          |
| Extract error message     | `getGraphQLErrorMessage(error)`                                   |
| Check if auth error       | `isAuthError(error)`                                              |
| Import error utils        | `import { getGraphQLErrorMessage, isAuthError } from '../api'`    |
| Aggregate errors in hook  | `queryError ? getGraphQLErrorMessage(queryError) : null`          |
| Clear mutation errors     | `mutation.reset()`                                                |
