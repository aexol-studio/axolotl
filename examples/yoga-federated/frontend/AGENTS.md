# Frontend Development Guide

## Overview

This frontend communicates with the Axolotl GraphQL backend using **Zeus**, a type-safe GraphQL client that is auto-generated from the schema.

The frontend uses:

- **React** with TypeScript
- **Vite** for bundling and SSR
- **Zustand** for state management
- **Zeus** for type-safe GraphQL queries

## Actual Project Structure

```
frontend/
├── src/
│   ├── api/                 # GraphQL client layer
│   │   ├── client.ts        # Chain client creation
│   │   ├── query.ts         # Query helper
│   │   ├── mutation.ts      # Mutation helper
│   │   ├── subscription.ts  # Subscription helper
│   │   └── index.ts         # Re-exports
│   ├── components/          # React components
│   │   ├── AuthForm.tsx
│   │   ├── Header.tsx
│   │   ├── Toast.tsx
│   │   ├── TodoForm.tsx
│   │   ├── TodoItem.tsx
│   │   ├── TodoList.tsx
│   │   └── index.ts
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts       # Authentication logic
│   │   ├── useTodos.ts      # Todo CRUD operations
│   │   ├── useTodoSubscription.ts
│   │   └── index.ts
│   ├── routes/              # Page components
│   │   ├── Dashboard.tsx
│   │   └── Landing.tsx
│   ├── stores/              # Zustand state stores
│   │   ├── authStore.ts     # Auth state (token, user)
│   │   ├── toastStore.ts    # Toast notifications
│   │   └── index.ts
│   ├── zeus/                # Auto-generated (DO NOT EDIT)
│   │   ├── const.ts
│   │   └── index.ts
│   ├── types.ts             # Shared TypeScript types
│   ├── App.tsx              # Root component
│   ├── entry-client.tsx     # Client hydration entry
│   └── entry-server.tsx     # SSR render entry
├── index.html
└── tsconfig.json
```

## Critical Rules for Frontend Development

1. **ALWAYS use Zeus** for GraphQL communication - never write raw GraphQL queries
2. **Use the api/ layer** - import from `../api` not directly from Zeus
3. **Use Zustand stores** for shared state (auth, toasts)
4. **SSR-safe code** - check `typeof window` before accessing browser APIs
5. **Use hooks** for data fetching logic - keep components presentational
6. **ALWAYS define Selectors** for reusable query shapes
7. **ALWAYS use `FromSelector`** to derive TypeScript types from selectors
8. **NEVER manually duplicate backend types** - derive them from selectors
9. **Use `$` function** for GraphQL variables when values come from user input or props


---

## State Management with Zustand

### Auth Store (stores/authStore.ts)

Manages authentication state with SSR-safe localStorage persistence:

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

// SSR-safe storage
const getStorage = () => {
  if (typeof window === 'undefined') {
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  }
  return localStorage;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      logout: () => set({ token: null, user: null, error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => getStorage()),
      partialize: (state) => ({ token: state.token }), // Only persist token
    },
  ),
);
```

### Toast Store (stores/toastStore.ts)

Manages toast notifications with auto-dismiss:

```typescript
import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'info', duration = 4000) => {
    const id = crypto.randomUUID();
    set((state) => ({ toasts: [...state.toasts, { id, message, type, duration }] }));
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, duration);
    }
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

// Helper for easy toast creation
export const toast = {
  success: (msg: string) => useToastStore.getState().addToast(msg, 'success'),
  error: (msg: string) => useToastStore.getState().addToast(msg, 'error'),
  info: (msg: string) => useToastStore.getState().addToast(msg, 'info'),
};
```

---

## GraphQL API Layer

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

### Usage in Hooks

```typescript
import { query, mutation } from '../api';

// Fetching data
const data = await query()({
  user: {
    todos: { _id: true, content: true, done: true },
  },
});

// Mutations
await mutation()({
  user: {
    createTodo: [{ content: 'New task' }, true],
  },
});

// Login
const data = await mutation()({
  login: [{ username, password }, true],
});
```

---

## Custom Hooks

### useAuth Hook (hooks/useAuth.ts)

```typescript
import { useCallback, useEffect } from 'react';
import { useAuthStore } from '../stores';
import { query, mutation } from '../api';
import type { AuthMode } from '../types';

export function useAuth() {
  const { token, user, isLoading, error, setToken, setUser, setLoading, setError, logout } = useAuthStore();

  const fetchUser = useCallback(async () => {
    if (!token) return null;
    setLoading(true);
    try {
      const data = await query()({
        user: { me: { _id: true, username: true } },
      });
      if (data.user?.me) {
        setUser(data.user.me);
        return data.user.me;
      }
      return null;
    } catch (err) {
      // Handle unauthorized
      if (err.message?.includes('Unauthorized')) logout();
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Auto-fetch user when token changes
  useEffect(() => {
    if (token && !user) fetchUser();
  }, [token, user, fetchUser]);

  const authenticate = async (mode: AuthMode, username: string, password: string) => {
    setLoading(true);
    try {
      const mutationName = mode === 'register' ? 'register' : 'login';
      const data = await mutation()({
        [mutationName]: [{ username, password }, true],
      });
      setToken(data[mutationName]);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated: !!token,
    authenticate,
    logout,
    clearError: () => setError(null),
  };
}
```

### useTodos Hook (hooks/useTodos.ts)

```typescript
import { useState, useCallback } from 'react';
import { useAuthStore } from '../stores';
import { query, mutation } from '../api';
import type { Todo } from '../types';

export function useTodos() {
  const token = useAuthStore((state) => state.token);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await query()({
        user: { todos: { _id: true, content: true, done: true } },
      });
      if (data.user?.todos) setTodos(data.user.todos);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const createTodo = async (content: string) => {
    if (!token || !content.trim()) return false;
    setIsLoading(true);
    try {
      await mutation()({
        user: { createTodo: [{ content }, true] },
      });
      await fetchTodos();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const markDone = async (todoId: string) => {
    if (!token) return false;
    setIsLoading(true);
    try {
      await mutation()({
        user: { todoOps: [{ _id: todoId }, { markDone: true }] },
      });
      await fetchTodos();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    todos,
    isLoading,
    error,
    fetchTodos,
    createTodo,
    markDone,
    clearTodos: () => setTodos([]),
    clearError: () => setError(null),
  };
}
```

---

## Types (types.ts)

Shared TypeScript types used across the frontend:

```typescript
export type Todo = {
  _id: string;
  content: string;
  done?: boolean | null;
};

export type User = {
  _id: string;
  username: string;
};

export type AuthMode = 'login' | 'register';
```

---

## Advanced Zeus Patterns (Optional)

These patterns are available but not currently used in this project. They can improve type safety and reusability.

### Using Selectors

Selectors define reusable query shapes:

```typescript
import { Selector, FromSelector } from '../zeus/index';

// Define selector
const todoSelector = Selector('Todo')({
  _id: true,
  content: true,
  done: true,
});

// Derive type from selector (instead of manual type definition)
type Todo = FromSelector<typeof todoSelector, 'Todo'>;

// Use in query
const data = await query()({
  user: { todos: todoSelector },
});
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

## Best Practices

1. **Use the api/ layer** - Don't import Zeus directly in components
2. **Keep hooks focused** - One hook per domain (auth, todos, etc.)
3. **Use Zustand for shared state** - Auth token, user data, notifications
4. **SSR-safe code** - Always check `typeof window` before browser APIs
5. **Handle errors gracefully** - Wrap API calls in try/catch
6. **Use loading states** - Track loading state for better UX
7. **Centralize types** - Keep shared types in `types.ts`

---

## Troubleshooting

### Type errors after schema changes

**Solution:** Regenerate Zeus by running `npx @aexol/axolotl build` in the project root

### Zeus files not found

**Solution:** Ensure `axolotl.json` has zeus configuration:

```json
{
  "zeus": [
    {
      "generationPath": "frontend/src",
      "esModule": true
    }
  ]
}
```

### SSR hydration mismatch

**Solution:** Ensure state that differs between server/client is handled:

```typescript
// Use SSR-safe storage
const getStorage = () => {
  if (typeof window === 'undefined') {
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  }
  return localStorage;
};
```

### Auth token not persisting

**Solution:** Check that Zustand persist middleware is configured with SSR-safe storage.

---

## Quick Reference

| Task                   | Code                                                    |
| ---------------------- | ------------------------------------------------------- |
| Create query           | `query()({ user: { todos: { _id: true } } })`           |
| Create mutation        | `mutation()({ login: [{ username, password }, true] })` |
| Access auth state      | `useAuthStore((s) => s.token)`                          |
| Show toast             | `toast.success('Done!')`                                |
| Mutation with args     | `mutation()({ field: [{ arg: value }, selector] })`     |
| Return scalar directly | `field: [{ args }, true]`                               |
