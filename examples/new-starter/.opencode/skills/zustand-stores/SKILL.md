---
name: zustand-stores
description: Zustand state management patterns - auth store with SSR-safe initialization and store best practices
---

## State Management with Zustand

### Auth Store (stores/authStore.ts)

Manages authentication state with SSR-safe initialization from server-rendered data:

```typescript
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  logout: () => void;
}

// Initialize from SSR-injected flag (set by server when valid session cookie exists)
// Note: window.__INITIAL_AUTH__ is typed via global.d.ts Window interface augmentation
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

---

## Key Patterns

1. **Use Zustand stores** for shared state (auth, UI state)
2. **SSR-safe code** — always check `typeof window` before accessing browser APIs
3. **No persist needed for auth** — authentication state comes from httpOnly cookies (managed by browser) and SSR-injected `__INITIAL_AUTH__`
4. **Access store state outside React** with `useStore.getState()` for helpers
5. **Use selectors** when accessing store: `useAuthStore((s) => s.isAuthenticated)` instead of destructuring the whole store

---

## Quick Reference

| Task              | Code                                     |
| ----------------- | ---------------------------------------- |
| Access auth state | `useAuthStore((s) => s.isAuthenticated)` |

## Troubleshooting

### SSR hydration mismatch

**Solution:** Ensure state that differs between server/client is handled with SSR-safe initialization from server data:

```typescript
// SSR-safe initialization from server data
// window.__INITIAL_AUTH__ is typed via global.d.ts Window interface augmentation
const getInitialAuth = (): boolean => {
  if (typeof window !== 'undefined' && window.__INITIAL_AUTH__) {
    return window.__INITIAL_AUTH__.isAuthenticated;
  }
  return false;
};
```

### Auth state lost on refresh

**Solution:** Auth state is derived from httpOnly cookies (sent automatically by the browser) and the `__INITIAL_AUTH__` flag injected during SSR. If auth state is lost, check that the server is reading the cookie and injecting the flag correctly. See the Authentication Architecture section in AGENTS.md for the full SSR auth flow.
