import { useCallback, useEffect } from 'react';
import { useAuthStore } from '../stores';
import { query, mutation } from '../api';
import type { AuthMode } from '../types';

export function useAuth() {
  const { token, user, isLoading, error, setToken, setUser, setLoading, setError, logout } = useAuthStore();

  const fetchUser = useCallback(async () => {
    if (!token) return null;
    setLoading(true);
    setError(null);
    try {
      const data = await query()({
        user: {
          me: { _id: true, username: true },
        },
      });
      if (data.user?.me) {
        setUser(data.user.me);
        return data.user.me;
      }
      return null;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch user';
      setError(message);
      if (message.includes('Unauthorized')) {
        logout();
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, setLoading, setError, setUser, logout]);

  // Fetch user when token changes
  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token, user, fetchUser]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await mutation()({
        login: [{ username, password }, true],
      });
      setToken(data.login);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await mutation()({
        register: [{ username, password }, true],
      });
      setToken(data.register);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const authenticate = async (mode: AuthMode, username: string, password: string) => {
    if (mode === 'register') {
      return register(username, password);
    }
    return login(username, password);
  };

  const clearError = () => setError(null);

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated: !!token,
    authenticate,
    logout,
    clearError,
  };
}
