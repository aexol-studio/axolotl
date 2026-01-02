import { useState, useCallback } from 'react';
import { useAuthStore } from '../stores';
import { query, mutation } from '../api';
import type { Todo } from '../types';

export function useTodos() {
  const token = useAuthStore((state) => state.token);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await query()({
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
  }, [token]);

  const createTodo = async (content: string) => {
    if (!token || !content.trim()) return false;
    setIsLoading(true);
    setError(null);
    try {
      await mutation()({
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
      await mutation()({
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
