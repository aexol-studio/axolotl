/**
 * Centralized React Query keys — single source of truth for all cache operations.
 * Import `queryKeys` wherever you use queryKey, setQueryData, getQueryData, or invalidateQueries.
 */
export const queryKeys = {
  me: ['me'],
  todos: ['todos'],
  notes: ['notes'],
  sessions: ['sessions'],
} as const;
