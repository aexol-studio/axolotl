import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';
import { isAuthError, getGraphQLErrorMessage } from '../api/errors';
import { useAuthStore } from '../stores';

// NOTE: QueryClient is created outside React component tree, so useDynamite() hook
// cannot be used here. These toast strings remain in English as global fallbacks.
// The keys are registered in public/locales/en/common.json for completeness.

const queryClientConfig = {
  queryCache: new QueryCache({
    onError: (error) => {
      if (isAuthError(error)) {
        toast.info('Session expired. Please log in again.');
        fetch('/api/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => {});
        useAuthStore.getState().logout();
        queryClient.clear();
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
