# Frontend Development Guide (Boilerplate)

## Overview

This is a **minimal boilerplate frontend** for Axolotl applications. It provides:

- SSR-enabled React with Vite
- Zeus type-safe GraphQL client (auto-generated)
- Zustand state management with SSR-safe storage
- Simple API layer structure

The boilerplate is intentionally minimal - extend it as needed.

## Project Structure

```
frontend/src/
├── api/
│   ├── client.ts       # Zeus Chain factory with auth headers
│   ├── query.ts        # Query helper
│   ├── mutation.ts     # Mutation helper
│   ├── subscription.ts # SSE subscription helper
│   └── index.ts        # Exports + typed gql helpers
├── stores/
│   ├── authStore.ts    # SSR-safe auth state (Zustand)
│   └── index.ts        # Store exports
├── zeus/               # AUTO-GENERATED - DO NOT EDIT
│   ├── index.ts        # Zeus client
│   └── const.ts        # GraphQL constants
├── App.tsx             # Main component
├── entry-client.tsx    # Client hydration
└── entry-server.tsx    # SSR entry
```

---

## Critical Rules

1. **NEVER edit `zeus/` files** - regenerate with `npx @aexol/axolotl build`
2. **ALWAYS use the API layer** for GraphQL calls
3. **Use Zustand stores** for shared state
4. **Use SSR-safe patterns** (check `typeof window !== 'undefined'`)

---

## State Management with Zustand

### Auth Store

The boilerplate includes an SSR-safe auth store:

```typescript
// stores/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

// SSR-safe storage - returns noop on server
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
      logout: () => set({ token: null, user: null, error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => getStorage()),
      partialize: (state) => ({ token: state.token }),
    },
  ),
);
```

### Using in Components

```typescript
import { useAuthStore } from '../stores/authStore';

function MyComponent() {
  const { token, user, setToken, logout } = useAuthStore();

  if (!token) {
    return <LoginForm onLogin={(t) => setToken(t)} />;
  }

  return (
    <div>
      <p>Welcome, {user?.username}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## GraphQL API Layer

### Client Setup (api/client.ts)

Creates a Zeus Chain with auth headers from the store:

```typescript
import { Chain } from '../zeus/index';
import { useAuthStore } from '../stores/authStore';

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

### Query Helper (api/query.ts)

```typescript
import { createChain } from './client';

// Usage: const data = await query()({ hello: true })
export const query = () => createChain()('query');
```

### Mutation Helper (api/mutation.ts)

```typescript
import { createChain } from './client';

// Usage: const data = await mutation()({ echo: [{ message: 'hello' }, true] })
export const mutation = () => createChain()('mutation');
```

### Subscription Helper (api/subscription.ts)

```typescript
import { SubscriptionSSE } from '../zeus/index';
import { useAuthStore } from '../stores/authStore';

export const subscription = () => {
  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['token'] = token;

  const host = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4103';
  return SubscriptionSSE(`${host}/graphql`, { headers });
};
```

### Typed API Helpers (api/index.ts)

For cleaner component code, the boilerplate includes typed helpers:

```typescript
import { query } from './query';
import { mutation } from './mutation';

export const gql = {
  query: {
    hello: async (): Promise<{ hello: string }> => {
      return query()({ hello: true });
    },
  },
  mutation: {
    echo: async (message: string): Promise<{ echo: string }> => {
      return mutation()({ echo: [{ message }, true] });
    },
  },
};
```

---

## Using the API

### Simple Usage with gql Helpers

```typescript
import { gql } from './api';

// In component
const data = await gql.query.hello();
console.log(data.hello); // "Hello from Axolotl!"

const result = await gql.mutation.echo('Hello!');
console.log(result.echo); // "Hello!"
```

### Direct Zeus Usage

For more complex queries, use the raw helpers:

```typescript
import { query, mutation } from './api';

// Query
const data = await query()({
  hello: true,
});

// Mutation with arguments
const result = await mutation()({
  echo: [{ message: 'Hello!' }, true],
});
```

### Subscriptions

```typescript
import { subscription } from './api';

// Countdown subscription
const countdownSub = subscription()({
  countdown: [{ from: 10 }, true],
});

countdownSub.on((data) => {
  console.log('Count:', data.countdown);
});
countdownSub.error((err) => console.error(err));
countdownSub.start();

// AI Chat subscription
const chatSub = subscription()({
  aiChat: [
    {
      messages: [{ role: 'user', content: 'Hello!' }],
      system: 'You are a helpful assistant.',
    },
    { content: true, done: true },
  ],
});

chatSub.on((data) => {
  if (!data.aiChat.done) {
    console.log('AI:', data.aiChat.content);
  }
});
chatSub.start();
```

---

## Example Component

```typescript
// App.tsx
import { useState } from 'react';
import { gql } from './api';

export default function App() {
  const [message, setMessage] = useState<string | null>(null);
  const [echoInput, setEchoInput] = useState('');
  const [echoResult, setEchoResult] = useState<string | null>(null);

  const fetchHello = async () => {
    const data = await gql.query.hello();
    setMessage(data.hello);
  };

  const sendEcho = async () => {
    if (!echoInput.trim()) return;
    const data = await gql.mutation.echo(echoInput);
    setEchoResult(data.echo);
  };

  return (
    <div>
      <button onClick={fetchHello}>Fetch Hello</button>
      {message && <p>{message}</p>}

      <input value={echoInput} onChange={(e) => setEchoInput(e.target.value)} />
      <button onClick={sendEcho}>Echo</button>
      {echoResult && <p>{echoResult}</p>}
    </div>
  );
}
```

---

## Extending the Frontend

### Adding New API Methods

1. Add to `api/index.ts`:

```typescript
export const gql = {
  query: {
    hello: async () => query()({ hello: true }),
    // Add new queries here
    users: async () => query()({ users: { _id: true, username: true } }),
  },
  mutation: {
    echo: async (message: string) => mutation()({ echo: [{ message }, true] }),
    // Add new mutations here
    login: async (username: string, password: string) => mutation()({ login: [{ username, password }, true] }),
  },
};
```

### Adding New Stores

Create in `stores/` following the SSR-safe pattern:

```typescript
// stores/todoStore.ts
import { create } from 'zustand';

interface Todo {
  _id: string;
  content: string;
  done: boolean;
}

interface TodoState {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  setTodos: (todos) => set({ todos }),
  addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
}));
```

### Adding Custom Hooks

Create a `hooks/` folder for reusable logic:

```typescript
// hooks/useTodos.ts
import { useState, useCallback } from 'react';
import { query, mutation } from '../api';
import { useTodoStore } from '../stores/todoStore';

export function useTodos() {
  const { todos, setTodos, addTodo } = useTodoStore();
  const [isLoading, setIsLoading] = useState(false);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await query()({
        user: { todos: { _id: true, content: true, done: true } },
      });
      if (data.user?.todos) setTodos(data.user.todos);
    } finally {
      setIsLoading(false);
    }
  }, [setTodos]);

  return { todos, isLoading, fetchTodos };
}
```

---

## Quick Reference

| Task                  | Code                                              |
| --------------------- | ------------------------------------------------- |
| Query                 | `gql.query.hello()` or `query()({ hello: true })` |
| Mutation              | `gql.mutation.echo(msg)` or `mutation()({...})`   |
| Subscription          | `subscription()({...}).on(cb).start()`            |
| Get auth state        | `useAuthStore.getState().token`                   |
| Use auth in component | `const { token } = useAuthStore()`                |
| SSR check             | `typeof window !== 'undefined'`                   |
| Regenerate Zeus       | `npx @aexol/axolotl build` (from project root)    |

---

## Troubleshooting

### Zeus files not found

Run `npx @aexol/axolotl build` from the project root.

### SSR hydration mismatch

Ensure stores use SSR-safe storage (check `typeof window`).

### Auth token not sent

Check that `createChain()` is called fresh (not cached) so it reads current token.

---

This boilerplate provides a minimal starting point. See `examples/yoga-federated/frontend/AGENTS.md` for a more complete frontend with hooks, selectors, and authentication flow.
