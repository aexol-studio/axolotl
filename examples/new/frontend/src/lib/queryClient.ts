import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { queryKeys } from './queryKeys.js';
import { toast } from 'sonner';
import { isAuthError, getGraphQLErrorMessage } from '../api/errors';
import { mutation } from '../api';

// NOTE: QueryClient is created outside React component tree, so useDynamite() hook
// cannot be used here. These toast strings remain in English as global fallbacks.
// The keys are registered in public/locales/en/common.json for completeness.

let isHandlingAuthError = false;

const queryClientConfig = {
  queryCache: new QueryCache({
    onError: async (error) => {
      if (typeof window === 'undefined') return; // SSR — skip client-side error handling
      if (isAuthError(error) && !isHandlingAuthError) {
        isHandlingAuthError = true;
        toast.info('Session expired. Please log in again.');
        await queryClient.cancelQueries();
        mutation()({ user: { logout: true } }).catch(() => {});
        queryClient.setQueryData(queryKeys.me, null);
        queryClient.clear();
        window.location.href = '/login';
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (isAuthError(error)) return; // handled by QueryCache already
      const message = getGraphQLErrorMessage(error);
      toast.error(message || 'An unexpected error occurred');
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount: number, error: unknown) => {
        if (isAuthError(error)) return false;
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
  },
};

export const createQueryClient = () => new QueryClient(queryClientConfig);

export const queryClient = new QueryClient(queryClientConfig);

/**
 * Shared type for the request context passed from entry-server.tsx to loaders via React Router's requestContext.
 * On SSR, `queryClient` is a per-request instance. On CSR, context is undefined — loaders fall back to the singleton.
 */
export interface AppLoadContext {
  queryClient: QueryClient;
}

/**
 * Check if the current user is authenticated by reading the queryClient cache.
 * Accepts an optional QueryClient for SSR per-request isolation.
 * Use in route loaders. In components, use `useAuth().isAuthenticated` instead.
 */
export const isAuthenticated = (qc?: QueryClient) => !!(qc ?? queryClient).getQueryData(queryKeys.me);
