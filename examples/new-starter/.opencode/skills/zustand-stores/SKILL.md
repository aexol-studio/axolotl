---
name: zustand-stores
description: Zustand state management patterns - auth store with SSR-safe localStorage persistence and store best practices
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

---

## Key Patterns

1. **Use Zustand stores** for shared state (auth, UI state)
2. **SSR-safe code** - always check `typeof window` before accessing browser APIs
3. **Use `partialize`** to control what gets persisted to localStorage
4. **Access store state outside React** with `useStore.getState()` for helpers
5. **Use selectors** when accessing store: `useAuthStore((s) => s.token)` instead of destructuring the whole store

---

## Quick Reference

| Task              | Code                           |
| ----------------- | ------------------------------ |
| Access auth state | `useAuthStore((s) => s.token)` |

## Troubleshooting

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
