import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '../stores';
import { query, mutation, getGraphQLErrorMessage } from '../api';

export type AuthMode = 'login' | 'register';

export const useAuth = () => {
  const token = useAuthStore((s) => s.token);
  const setToken = useAuthStore((s) => s.setToken);
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  // Fetch current user — only when token exists
  // React Query deduplicates: multiple components calling useAuth() = 1 request
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const data = await query()({
        user: { me: { _id: true, username: true } },
      });
      return data.user?.me ?? null;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const data = await mutation()({
        login: [{ username, password }, true],
      });
      return data.login as string;
    },
    onSuccess: (token) => {
      setToken(token);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Welcome back!');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const data = await mutation()({
        register: [{ username, password }, true],
      });
      return data.register as string;
    },
    onSuccess: (token) => {
      setToken(token);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Account created successfully!');
    },
  });

  const authenticate = async (mode: AuthMode, username: string, password: string) => {
    try {
      if (mode === 'register') {
        await registerMutation.mutateAsync({ username, password });
      } else {
        await loginMutation.mutateAsync({ username, password });
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

  const handleLogout = () => {
    logout(); // clears token; query cache is cleared by QueryCache.onError in queryClient.ts
  };

  const clearError = () => {
    loginMutation.reset();
    registerMutation.reset();
  };

  return {
    user: user ?? null,
    token,
    isLoading,
    error,
    isAuthenticated: !!token,
    authenticate,
    logout: handleLogout,
    clearError,
  };
};
