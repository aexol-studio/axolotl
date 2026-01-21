import { QueryClient } from '@tanstack/react-query';

// Create a new QueryClient instance with sensible defaults
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 5 minutes
        staleTime: 5 * 60 * 1000, // 5min
        // Cached data is garbage collected after 10 minutes of being unused
        gcTime: 10 * 60 * 1000, // 10min (formerly cacheTime in v4)
        // Retry failed requests once
        retry: 1,
        // Don't refetch on window focus in development (can be annoying)
        refetchOnWindowFocus: false,
        // Don't refetch on mount if data is fresh
        refetchOnMount: false,
      },
      mutations: {
        // Retry failed mutations once
        retry: 1,
      },
    },
  });
}

// Singleton for client-side
let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  // Server: always create a new QueryClient
  if (typeof window === 'undefined') {
    return createQueryClient();
  }

  // Browser: reuse existing QueryClient or create new one
  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }

  return browserQueryClient;
}
