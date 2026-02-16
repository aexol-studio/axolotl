import { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useDynamite } from '@aexol/dynamite';
import { useAuthStore } from '@/stores';
import { query, mutation, subscription, getGraphQLErrorMessage, todoSelector, type TodoType } from '@/api';

interface TodoUpdateEvent {
  todoUpdates: {
    type: 'CREATED' | 'UPDATED';
    todo: {
      _id: string;
      content: string;
      done?: boolean | null;
    };
  };
}

interface UseDashboardOptions {
  ownerId: string | null;
}

export const useDashboard = ({ ownerId }: UseDashboardOptions) => {
  const { t } = useDynamite();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  // --- Todo Query ---

  const {
    data: todos = [],
    isPending: todosLoading,
    error: queryError,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: async (): Promise<TodoType[]> => {
      const data = await query()({
        user: { todos: todoSelector },
      });
      return data.user?.todos ?? [];
    },
    enabled: isAuthenticated,
  });

  // --- Create Todo Mutation ---

  const createMutation = useMutation({
    mutationFn: async (content: string) => {
      await mutation()({
        user: { createTodo: [{ content }, true] },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success(t('Todo created!'));
    },
  });

  // --- Mark Done Mutation ---

  const markDoneMutation = useMutation({
    mutationFn: async (todoId: string) => {
      await mutation()({
        user: { todoOps: [{ _id: todoId }, { markDone: true }] },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success(t('Todo updated!'));
    },
  });

  const createTodo = async (content: string) => {
    if (!isAuthenticated || !content.trim()) return false;
    try {
      await createMutation.mutateAsync(content);
      return true;
    } catch {
      return false;
    }
  };

  const markDone = async (todoId: string) => {
    if (!isAuthenticated) return false;
    try {
      await markDoneMutation.mutateAsync(todoId);
      return true;
    } catch {
      return false;
    }
  };

  const todosError =
    (queryError ? getGraphQLErrorMessage(queryError) : null) ??
    (createMutation.error ? getGraphQLErrorMessage(createMutation.error) : null) ??
    (markDoneMutation.error ? getGraphQLErrorMessage(markDoneMutation.error) : null) ??
    null;

  const clearError = () => {
    createMutation.reset();
    markDoneMutation.reset();
  };

  // --- Todo Subscription ---

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscriptionRef = useRef<any>(null);
  useEffect(() => {
    // Invalidate todo query cache on any subscription event
    const invalidateTodos = () => queryClient.invalidateQueries({ queryKey: ['todos'] });

    // Only subscribe when we have a valid ownerId
    if (!ownerId) {
      return;
    }

    try {
      const sub = subscription()({
        todoUpdates: [
          { ownerId },
          {
            type: true,
            todo: {
              _id: true,
              content: true,
              done: true,
            },
          },
        ],
      });

      sub.on((data: TodoUpdateEvent) => {
        const { type, todo } = data.todoUpdates;

        if (type === 'CREATED') {
          toast.success(t('New todo: "{{content}}"', { content: todo.content }));
          invalidateTodos();
        } else if (type === 'UPDATED') {
          toast.info(t('Todo completed: "{{content}}"', { content: todo.content }));
          invalidateTodos();
        }
      });

      sub.error((err: unknown) => {
        console.error('[useDashboard] Subscription error:', err);
        toast.error(t('Lost connection to live updates. Refresh the page to reconnect.'));
      });

      sub.off(() => {
        console.log('[useDashboard] Subscription closed');
      });

      sub.open();
      subscriptionRef.current = sub;
    } catch (err) {
      console.error('[useDashboard] Failed to start subscription:', err);
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.close();
        subscriptionRef.current = null;
      }
    };
  }, [ownerId, queryClient, t]);

  return {
    todos,
    todosLoading,
    todosError,
    createTodo,
    markDone,
    clearError,
  };
};
