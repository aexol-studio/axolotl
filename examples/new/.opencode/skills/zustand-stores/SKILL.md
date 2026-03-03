---
name: zustand-stores
description: Zustand state management patterns - auth store with SSR-safe initialization and store best practices
---

## When to Use Zustand

Zustand is for **shared client state** — UI preferences, sidebar collapsed, feature toggles, etc.

Auth state is managed by React Query (`queryKeys.me` cache + `useAuth()` hook) — not Zustand.

## Store Pattern

```typescript
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
```

## Rules

- Check `typeof window !== 'undefined'` before accessing browser globals
- Use selectors: `useUIStore((s) => s.sidebarOpen)`, never destructure the whole store
- Access outside React: `useUIStore.getState()`
