import { useState, useCallback, useEffect } from 'react';
import { createGqlClient } from '../api';
import type { User, AuthMode } from '../types';

// SSR-safe localStorage access
const isBrowser = typeof window !== 'undefined';
const getStoredToken = () => (isBrowser ? localStorage.getItem('token') : null);

export function useAuth() {
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gql = useCallback(() => createGqlClient(token || undefined), [token]);
  const fetchUser = useCallback(async () => {
    if (!token) return null;
    setIsLoading(true);
    setError(null);
    console.log(token);
    try {
      const data = await gql()('query')({
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
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
      if (err instanceof Error && err.message.includes('Unauthorized')) {
        logout();
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [gql]);

  useEffect(() => {
    if (!isBrowser) return;
    if (token) {
      localStorage.setItem('token', token);
      fetchUser();
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await gql()('mutation')({
        login: [{ username, password }, true],
      });
      setToken(data.login);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await gql()('mutation')({
        register: [{ username, password }, true],
      });
      setToken(data.register);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const authenticate = async (mode: AuthMode, username: string, password: string) => {
    if (mode === 'register') {
      return register(username, password);
    }
    return login(username, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
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
    gql,
  };
}
