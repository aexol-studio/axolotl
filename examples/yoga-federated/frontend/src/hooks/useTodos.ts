import { useState, useCallback } from 'react';
import { createGqlClient } from '../api';
import type { Todo } from '../types';

export function useTodos(token: string | null) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gql = useCallback(() => createGqlClient(token || undefined), [token]);

  const fetchTodos = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await gql()('query')({
        user: {
          todos: { _id: true, content: true, done: true },
        },
      });
      if (data.user?.todos) {
        setTodos(data.user.todos);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setIsLoading(false);
    }
  }, [token, gql]);

  const createTodo = async (content: string) => {
    if (!token || !content.trim()) return false;
    setIsLoading(true);
    setError(null);
    try {
      await gql()('mutation')({
        user: {
          createTodo: [{ content }, true],
        },
      });
      await fetchTodos();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const markDone = async (todoId: string) => {
    if (!token) return false;
    setIsLoading(true);
    setError(null);
    try {
      await gql()('mutation')({
        user: {
          todoOps: [{ _id: todoId }, { markDone: true }],
        },
      });
      await fetchTodos();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark todo as done');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearTodos = () => setTodos([]);
  const clearError = () => setError(null);

  return {
    todos,
    isLoading,
    error,
    fetchTodos,
    createTodo,
    markDone,
    clearTodos,
    clearError,
  };
}
