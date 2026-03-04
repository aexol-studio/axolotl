import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useDynamite } from '@aexol/dynamite';
import { query, mutation, userSelector, getGraphQLErrorMessage, getGraphQLErrorCode } from '../api';
import { queryKeys } from '@/lib/queryKeys.js';

export type AuthMode = 'login' | 'register';

export type AuthResult =
  | { status: 'authenticated' }
  | { status: 'verification_required'; message: string }
  | { status: 'error' };

// Fetch current user data from the `me` query.
// Throws on auth errors — the global QueryCache onError handler catches those.
const fetchMe = async () => {
  const data = await query()({ user: { me: userSelector } });
  return data.user?.me ?? null;
};

export const useAuth = () => {
  const { t } = useDynamite();
  const queryClient = useQueryClient();

  const fetchFreshMe = () =>
    queryClient.fetchQuery({
      queryKey: queryKeys.me,
      queryFn: fetchMe,
      staleTime: 0,
    });

  // Single source of truth: React Query cache for queryKeys.me
  // - SSR populates the cache (either user data or null) via root loader
  // - HydrationBoundary rehydrates it on the client
  // - staleTime prevents refetch within 5 minutes
  // - After login, invalidateQueries forces a fresh fetch
  // - retry: false avoids retrying auth errors (expired token etc.)
  const {
    data: user = null,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchMe,
    staleTime: 1000 * 60 * 5,
    retry: false,
    // Skip auto-refetch for guests: root loader always seeds cache (user or null).
    // Login/register call invalidateQueries(queryKeys.me) which overrides enabled.
    enabled: !!queryClient.getQueryData(queryKeys.me),
  });

  const isAuthenticated = !!user;

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const data = await mutation()({ login: [{ email, password }, true] });
      return data.login as string;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
      toast.success(t('Welcome back!'));
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const data = await mutation()({ register: [{ email, password }, true] });
      return data.register as string;
    },
  });

  const authenticate = async (mode: AuthMode, email: string, password: string): Promise<AuthResult> => {
    try {
      if (mode === 'register') {
        const result = await registerMutation.mutateAsync({ email, password });
        // Always force a fresh `me` fetch after register.
        // This avoids relying on invalidation and bypasses the guest `enabled` guard.
        try {
          const meData = await fetchFreshMe();
          if (meData) {
            toast.success(t('Account created successfully!'));
            return { status: 'authenticated' };
          }
        } catch {
          // fetchMe threw — no auth cookie was set
        }
        // No user data → email verification is required
        return { status: 'verification_required', message: result };
      } else {
        await loginMutation.mutateAsync({ email, password });
        const meData = await fetchFreshMe();
        if (!meData) {
          return { status: 'error' };
        }
        return { status: 'authenticated' };
      }
    } catch {
      return { status: 'error' };
    }
  };

  // Build error message — detect EMAIL_NOT_VERIFIED for a specific user-friendly message
  const loginErrorCode = loginMutation.error ? getGraphQLErrorCode(loginMutation.error) : null;
  const isEmailNotVerified = loginErrorCode === 'EMAIL_NOT_VERIFIED';

  const isLoading = isUserLoading || loginMutation.isPending || registerMutation.isPending;
  const error = isEmailNotVerified
    ? t('Please verify your email before signing in. Check your inbox for the verification link.')
    : ((userError ? getGraphQLErrorMessage(userError) : null) ??
      (loginMutation.error ? getGraphQLErrorMessage(loginMutation.error) : null) ??
      (registerMutation.error ? getGraphQLErrorMessage(registerMutation.error) : null) ??
      null);

  // Logout: call API to clear cookie, then clear React Query cache
  const handleLogout = async () => {
    await queryClient.cancelQueries();
    try {
      await mutation()({ user: { logout: true } });
    } catch {
      // Even if the API call fails, clear local state
    }
    queryClient.setQueryData(queryKeys.me, null);
    queryClient.clear();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const clearError = () => {
    loginMutation.reset();
    registerMutation.reset();
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isEmailNotVerified,
    authenticate,
    logout: handleLogout,
    clearError,
  };
};
