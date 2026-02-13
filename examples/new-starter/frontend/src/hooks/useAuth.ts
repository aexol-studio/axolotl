import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '../stores';
import { query, mutation, getGraphQLErrorMessage } from '../api';
import { useInitialAuth } from '../contexts/AuthContext';

export type AuthMode = 'login' | 'register';

export const useAuth = () => {
  const storeIsAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const storeLogout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  const initialAuth = useInitialAuth();

  // SSR: store is always false (no window), so use AuthContext (set from cookie)
  // Client: store is initialized synchronously from window.__INITIAL_AUTH__, so trust it
  // After logout: store is false → correctly returns false
  const isAuthenticated = typeof window === 'undefined' ? initialAuth.isAuthenticated : storeIsAuthenticated;

  // Fetch current user — only when authenticated
  // React Query deduplicates: multiple components calling useAuth() = 1 request
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const data = await query()({
        user: { me: { _id: true, email: true, createdAt: true } },
      });
      return data.user?.me ?? null;
    },
    enabled: isAuthenticated, // uses computed isAuthenticated (SSR-safe)
    staleTime: 1000 * 60 * 5, // 5 min
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const data = await mutation()({
        login: [{ email, password }, true],
      });
      return data.login as string;
    },
    onSuccess: () => {
      setAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Welcome back!');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const data = await mutation()({
        register: [{ email, password }, true],
      });
      return data.register as string;
    },
    onSuccess: () => {
      setAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Account created successfully!');
    },
  });

  const authenticate = async (mode: AuthMode, email: string, password: string) => {
    try {
      if (mode === 'register') {
        await registerMutation.mutateAsync({ email, password });
      } else {
        await loginMutation.mutateAsync({ email, password });
      }
      return true;
    } catch {
      return false;
    }
  };

  const isLoading = isUserLoading || loginMutation.isPending || registerMutation.isPending;
  const error =
    (userError ? getGraphQLErrorMessage(userError) : null) ??
    (loginMutation.error ? getGraphQLErrorMessage(loginMutation.error) : null) ??
    (registerMutation.error ? getGraphQLErrorMessage(registerMutation.error) : null) ??
    null;

  // Logout: call API to clear cookie, then update local state
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
    } catch {
      // Even if the API call fails, clear local state
    }
    storeLogout();
    queryClient.clear();
  };

  const clearError = () => {
    loginMutation.reset();
    registerMutation.reset();
  };

  return {
    user: user ?? null,
    isLoading,
    error,
    isAuthenticated,
    authenticate,
    logout: handleLogout,
    clearError,
  };
};
