import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAuthSession } from '../../features/auth/useAuthSession'
import { isAuthInvalidationError } from '../../features/auth/sessionPolicy'
import { createGraphqlClient } from '../../lib/graphql/client'
import { AppTypedError } from '../../lib/errors/normalizeError'
import { useAuthStore } from '../../stores/authStore'
import {
  applyOfflineOverlay,
  clearTodoOfflineState,
  enqueueTodoOperation,
  incrementOperationAttempt,
  readOfflineTodoState,
  removeQueuedOperation,
  retryDeadLetters,
  saveTodoSnapshot,
} from '../../features/todo/offlinePersistence'
import type { TodoFilter, TodoStats } from './types'

export const todosQueryKey = ['todos', 'list'] as const

const toTodoItem = (todo: {
  _id: string
  content: string
  done?: boolean | null
}) => ({
  id: todo._id,
  title: todo.content,
  completed: Boolean(todo.done),
})

const readTodos = async () => {
  const client = createGraphqlClient()
  const data = await client('query')({
    user: {
      todos: {
        _id: true,
        content: true,
        done: true,
      },
    },
  })

  const todos = data.user?.todos ?? []
  return todos.map(toTodoItem)
}

const markDoneRequest = async (id: string) => {
  const client = createGraphqlClient()
  await client('mutation')({
    user: {
      todoOps: [
        {
          _id: id,
        },
        {
          markDone: true,
        },
      ],
    },
  })
}

const createTodoRequest = async (content: string) => {
  const client = createGraphqlClient()
  await client('mutation')({
    user: {
      createTodo: [
        {
          content,
        },
        true,
      ],
    },
  })
}

const isOnlineNow = () => {
  if (typeof navigator === 'undefined') {
    return true
  }

  if (typeof navigator.onLine !== 'boolean') {
    return true
  }

  return navigator.onLine
}

export const useTodosQuery = (enabled: boolean) => {
  const queryClient = useQueryClient()
  const { handleAuthInvalidation } = useAuthSession()
  const accessToken = useAuthStore((state) => state.accessToken)
  const [offlineSnapshot, setOfflineSnapshot] = useState<
    readonly ReturnType<typeof toTodoItem>[]
  >([])
  const [queuedCount, setQueuedCount] = useState(0)
  const [deadLetterCount, setDeadLetterCount] = useState(0)
  const [isOfflineFallback, setIsOfflineFallback] = useState(false)
  const [isSyncingQueue, setIsSyncingQueue] = useState(false)

  const refreshOfflineProjection = useCallback(async () => {
    const offlineState = await readOfflineTodoState()
    const projected = applyOfflineOverlay(
      offlineState.snapshot?.items ?? [],
      offlineState.queue,
    )
    setOfflineSnapshot(projected)
    setQueuedCount(offlineState.queue.length)
    setDeadLetterCount(offlineState.deadLetters.length)
  }, [])

  const flushQueue = useCallback(async () => {
    if (!enabled || !accessToken || !isOnlineNow()) {
      return
    }

    const offlineState = await readOfflineTodoState()
    if (offlineState.queue.length === 0) {
      await refreshOfflineProjection()
      return
    }

    setIsSyncingQueue(true)
    try {
      for (const operation of offlineState.queue) {
        try {
          if (operation.type === 'create') {
            await createTodoRequest(operation.payload.content)
          } else {
            await markDoneRequest(operation.payload.todoId)
          }

          await removeQueuedOperation(operation.id)
        } catch (error) {
          const message =
            error instanceof Error ? error.message.toLowerCase() : String(error)

          if (message.includes('unauth') || message.includes('forbidden')) {
            await handleAuthInvalidation()
            return
          }

          await incrementOperationAttempt(operation.id)
        }
      }
    } finally {
      setIsSyncingQueue(false)
      await refreshOfflineProjection()
    }

    await queryClient.invalidateQueries({ queryKey: todosQueryKey })
  }, [
    accessToken,
    enabled,
    handleAuthInvalidation,
    queryClient,
    refreshOfflineProjection,
  ])

  const todosQuery = useQuery({
    queryKey: todosQueryKey,
    enabled,
    queryFn: async () => {
      try {
        const items = await readTodos()
        await saveTodoSnapshot(items)
        setIsOfflineFallback(false)
        return items
      } catch (error) {
        const offlineState = await readOfflineTodoState()
        if (offlineState.snapshot) {
          setIsOfflineFallback(true)
          return applyOfflineOverlay(
            offlineState.snapshot.items,
            offlineState.queue,
          )
        }

        throw error
      }
    },
  })

  const createTodoMutation = useMutation({
    mutationFn: async (content: string) => {
      const normalized = content.trim()
      if (!normalized) {
        throw new AppTypedError(
          'VALIDATION_ERROR',
          'common.todo.composerPlaceholder',
        )
      }

      if (!enabled || !accessToken) {
        throw new AppTypedError(
          'UNKNOWN_ERROR',
          'common.todo.authRequiredTitle',
        )
      }

      if (!isOnlineNow()) {
        await enqueueTodoOperation({
          type: 'create',
          payload: {
            content: normalized,
          },
        })
        await refreshOfflineProjection()
        return
      }

      try {
        await createTodoRequest(normalized)
      } catch (error) {
        if (isAuthInvalidationError(error)) {
          await handleAuthInvalidation()
          throw error
        }

        await enqueueTodoOperation({
          type: 'create',
          payload: {
            content: normalized,
          },
        })
        await refreshOfflineProjection()
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: todosQueryKey })
      await flushQueue()
    },
  })

  const markDoneMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!enabled || !accessToken) {
        throw new AppTypedError(
          'UNKNOWN_ERROR',
          'common.todo.authRequiredTitle',
        )
      }

      if (!isOnlineNow()) {
        await enqueueTodoOperation({
          type: 'markDone',
          payload: {
            todoId: id,
          },
        })
        await refreshOfflineProjection()
        return
      }

      try {
        await markDoneRequest(id)
      } catch (error) {
        if (isAuthInvalidationError(error)) {
          await handleAuthInvalidation()
          throw error
        }

        await enqueueTodoOperation({
          type: 'markDone',
          payload: {
            todoId: id,
          },
        })
        await refreshOfflineProjection()
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: todosQueryKey })
      await flushQueue()
    },
  })

  useEffect(() => {
    void refreshOfflineProjection()
  }, [refreshOfflineProjection])

  useEffect(() => {
    if (!enabled || !accessToken) {
      void clearTodoOfflineState()
      setQueuedCount(0)
      setDeadLetterCount(0)
      setOfflineSnapshot([])
      return
    }

    void flushQueue()
  }, [accessToken, enabled, flushQueue])

  const todosData = useMemo(() => {
    const fromQuery = todosQuery.data ?? []
    if (!isOfflineFallback) {
      return fromQuery
    }

    return offlineSnapshot.length > 0 ? offlineSnapshot : fromQuery
  }, [isOfflineFallback, offlineSnapshot, todosQuery.data])

  const stats = useMemo<TodoStats>(() => {
    const total = todosData.length
    const completed = todosData.filter((todo) => todo.completed).length

    return {
      total,
      completed,
      active: total - completed,
    }
  }, [todosData])

  const getFilteredTodos = (filter: TodoFilter) => {
    if (filter === 'active') {
      return todosData.filter((todo) => !todo.completed)
    }

    if (filter === 'completed') {
      return todosData.filter((todo) => todo.completed)
    }

    return todosData
  }

  return {
    todosQuery,
    createTodoMutation,
    markDoneMutation,
    stats,
    getFilteredTodos,
    queuedCount,
    deadLetterCount,
    isOfflineFallback,
    isSyncingQueue,
    flushQueue,
    retryDeadLetters,
  }
}
