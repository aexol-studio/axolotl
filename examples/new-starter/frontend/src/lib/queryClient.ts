import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';
import { isAuthError, getGraphQLErrorMessage } from '../api/errors';
import { useAuthStore } from '../stores';

export const queryClient = new QueryClient({
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
      retry: (failureCount, error) => {
        if (isAuthError(error)) return false;
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
  },
});
