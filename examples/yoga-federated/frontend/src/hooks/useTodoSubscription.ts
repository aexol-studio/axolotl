import { useEffect, useRef } from 'react';
import { subscription } from '../api';
import { toast } from '../stores';

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

interface UseTodoSubscriptionOptions {
  ownerId: string | null;
  onTodoCreated?: (todo: TodoUpdateEvent['todoUpdates']['todo']) => void;
  onTodoUpdated?: (todo: TodoUpdateEvent['todoUpdates']['todo']) => void;
}

export function useTodoSubscription({ ownerId, onTodoCreated, onTodoUpdated }: UseTodoSubscriptionOptions) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscriptionRef = useRef<any>(null);
  // Store callbacks in refs to avoid dependency issues
  const onTodoCreatedRef = useRef(onTodoCreated);
  const onTodoUpdatedRef = useRef(onTodoUpdated);

  // Keep refs up to date
  useEffect(() => {
    onTodoCreatedRef.current = onTodoCreated;
    onTodoUpdatedRef.current = onTodoUpdated;
  }, [onTodoCreated, onTodoUpdated]);

  useEffect(() => {
    // Only subscribe when we have an ownerId
    if (!ownerId) {
      console.log('[useTodoSubscription] No ownerId, skipping subscription');
      return;
    }

    console.log('[useTodoSubscription] Starting subscription for ownerId:', ownerId);

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

      sub.on((data) => {
        console.log('[useTodoSubscription] Received data:', data);
        const { type, todo } = data.todoUpdates;

        if (type === 'CREATED') {
          toast.success(`New todo: "${todo.content}"`);
          onTodoCreatedRef.current?.(todo);
        } else if (type === 'UPDATED') {
          toast.info(`Todo completed: "${todo.content}"`);
          onTodoUpdatedRef.current?.(todo);
        }
      });

      sub.error((err: unknown) => {
        console.error('[useTodoSubscription] Subscription error:', err);
      });

      sub.off(() => {
        console.log('[useTodoSubscription] Subscription closed');
      });

      console.log('[useTodoSubscription] Subscription started successfully');
      subscriptionRef.current = sub;
    } catch (err) {
      console.error('[useTodoSubscription] Failed to start subscription:', err);
    }

    // Cleanup on unmount or when ownerId changes
    return () => {
      console.log('[useTodoSubscription] Cleaning up subscription');
      if (subscriptionRef.current) {
        subscriptionRef.current.close();
        subscriptionRef.current = null;
      }
    };
  }, [ownerId]); // Only depend on ownerId

  return {
    isSubscribed: !!subscriptionRef.current,
  };
}
