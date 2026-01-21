import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { gql } from './index';

// ============================================================================
// Query Keys - centralized and type-safe
// ============================================================================

export const queryKeys = {
  // Hello query
  hello: ['hello'] as const,

  // Settings query
  settings: ['settings'] as const,

  // User profile (can be extended with user ID)
  user: (id?: string) => (id ? (['user', id] as const) : (['user'] as const)),

  // Items for infinite query demo
  items: (filters?: Record<string, unknown>) => (filters ? (['items', filters] as const) : (['items'] as const)),
} as const;

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * useHelloQuery - Fetches the hello message from GraphQL API
 * Used in home page with prefetching in loader
 */
export function useHelloQuery() {
  return useQuery({
    queryKey: queryKeys.hello,
    queryFn: async () => {
      const data = await gql.query.hello();
      return data.hello;
    },
  });
}

/**
 * useSettingsQuery - Fetches user settings
 * Used in settings page with manual refetch capability
 */
export interface Settings {
  updatedAt: string;
  theme: string;
  notifications: boolean;
  language: string;
}

export function useSettingsQuery() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: async (): Promise<Settings> => {
      // Mock settings data (replace with real GraphQL query when available)
      return {
        updatedAt: new Date().toISOString(),
        theme: 'dark',
        notifications: true,
        language: 'en',
      };
    },
  });
}

/**
 * useUserQuery - Fetches user profile data
 * Used in profile page for authenticated users
 */
export interface User {
  id: string;
  name: string;
}

export function useUserQuery(userId?: string) {
  return useQuery({
    queryKey: queryKeys.user(userId),
    queryFn: async (): Promise<User | null> => {
      // Mock user data (replace with real GraphQL query when available)
      // In real app, this would fetch from your API
      if (!userId) return null;

      return {
        id: userId,
        name: 'Demo User',
      };
    },
    enabled: !!userId, // Only run query if userId is provided
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * useEchoMutation - Sends a message and echoes it back
 * Used in home page with automatic query invalidation
 */
export function useEchoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: string) => {
      const data = await gql.mutation.echo(message);
      return data.echo;
    },
    onSuccess: () => {
      // Invalidate hello query to trigger refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.hello });
    },
    onError: (error: unknown) => {
      console.error('Echo mutation failed:', error);
    },
  });
}

// ============================================================================
// Infinite Query Hooks
// ============================================================================

/**
 * Mock data for infinite query demo
 */
interface Item {
  id: number;
  title: string;
  description: string;
}

interface ItemsPage {
  items: Item[];
  nextCursor: number | null;
}

/**
 * Mock function to simulate paginated API
 */
async function fetchItemsPage(page: number): Promise<ItemsPage> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const pageSize = 10;
  const startId = page * pageSize + 1;

  // Generate mock items
  const items: Item[] = Array.from({ length: pageSize }, (_, i) => ({
    id: startId + i,
    title: `Item ${startId + i}`,
    description: `This is a description for item ${startId + i}`,
  }));

  // Return next cursor if more pages exist (limit to 5 pages for demo)
  const nextCursor = page < 4 ? page + 1 : null;

  return {
    items,
    nextCursor,
  };
}

/**
 * useItemsInfiniteQuery - Infinite scrolling list example
 * Used in about page to demonstrate infinite queries
 */
export function useItemsInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: queryKeys.items(),
    queryFn: ({ pageParam }: { pageParam: number }) => fetchItemsPage(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage: ItemsPage) => lastPage.nextCursor,
    getPreviousPageParam: () => null, // No previous page support in this demo
  });
}
