---
name: zustand-stores
description: Zustand state management patterns - auth store with SSR-safe initialization and store best practices
---

## Auth Store

**State:** `isAuthenticated: boolean`, `setAuthenticated(value)`, `logout()`

**SSR-safe init** — read from `window.__INITIAL_AUTH__` (injected by server on every render):

```typescript
const getInitialAuth = (): boolean => {
  if (typeof window !== 'undefined' && window.__INITIAL_AUTH__) {
    return window.__INITIAL_AUTH__.isAuthenticated;
  }
  return false;
};

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: getInitialAuth(),
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  logout: () => set({ isAuthenticated: false }),
}));
```

## Rules

- Always check `typeof window !== 'undefined'` before accessing browser globals
- **Use selectors** — `useAuthStore((s) => s.isAuthenticated)`, never destructure the whole store
- Access state outside React with `useAuthStore.getState()`
- No `persist` needed for auth — state is derived from httpOnly cookies + SSR-injected `__INITIAL_AUTH__`
