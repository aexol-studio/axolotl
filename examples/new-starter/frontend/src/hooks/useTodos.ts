import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '../stores';
import { query, mutation, getGraphQLErrorMessage, todoSelector, type TodoType } from '../api';

export const useTodos = () => {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  // Fetch todos — only when authenticated
  const {
    data: todos = [],
    isPending: isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: async (): Promise<TodoType[]> => {
      const data = await query()({
        user: { todos: todoSelector },
      });
      return data.user?.todos ?? [];
    },
    enabled: !!token,
  });

  // Create todo mutation
  const createMutation = useMutation({
    mutationFn: async (content: string) => {
      await mutation()({
        user: { createTodo: [{ content }, true] },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo created!');
    },
  });

  // Mark todo as done mutation
  const markDoneMutation = useMutation({
    mutationFn: async (todoId: string) => {
      await mutation()({
        user: { todoOps: [{ _id: todoId }, { markDone: true }] },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo updated!');
    },
  });

  const createTodo = async (content: string) => {
    if (!token || !content.trim()) return false;
    try {
      await createMutation.mutateAsync(content);
      return true;
    } catch {
      return false;
    }
  };

  const markDone = async (todoId: string) => {
    if (!token) return false;
    try {
      await markDoneMutation.mutateAsync(todoId);
      return true;
    } catch {
      return false;
    }
  };

  const error =
    (queryError ? getGraphQLErrorMessage(queryError) : null) ??
    (createMutation.error ? getGraphQLErrorMessage(createMutation.error) : null) ??
    (markDoneMutation.error ? getGraphQLErrorMessage(markDoneMutation.error) : null) ??
    null;

  const clearError = () => {
    createMutation.reset();
    markDoneMutation.reset();
  };

  return {
    todos,
    isLoading,
    error,
    createTodo,
    markDone,
    clearError,
  };
};
