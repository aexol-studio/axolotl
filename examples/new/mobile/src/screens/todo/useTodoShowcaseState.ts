import { useMemo, useState } from 'react'

import type { TodoFilter } from './types'
import { useTodosQuery } from './useTodosQuery'

type UseTodoShowcaseStateArgs = {
  isEnabled: boolean
}

export const useTodoShowcaseState = ({
  isEnabled,
}: UseTodoShowcaseStateArgs) => {
  const [composerValue, setComposerValue] = useState('')
  const [filter, setFilter] = useState<TodoFilter>('all')
  const {
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
  } = useTodosQuery(isEnabled)

  const filteredTodos = useMemo(
    () => getFilteredTodos(filter),
    [filter, getFilteredTodos],
  )

  const addTodo = async () => {
    const trimmed = composerValue.trim()
    if (!trimmed) {
      return false
    }

    await createTodoMutation.mutateAsync(trimmed)
    setComposerValue('')
    return true
  }

  const toggleTodo = async (id: string) => {
    await markDoneMutation.mutateAsync(id)
  }

  return {
    composerValue,
    setComposerValue,
    filter,
    setFilter,
    filteredTodos,
    stats,
    isLoading: todosQuery.isLoading,
    isFetching: todosQuery.isFetching,
    isError: todosQuery.isError,
    error: todosQuery.error,
    isMutating:
      createTodoMutation.isPending ||
      markDoneMutation.isPending ||
      todosQuery.isFetching,
    queuedCount,
    deadLetterCount,
    isOfflineFallback,
    isSyncingQueue,
    addTodo,
    toggleTodo,
    refetch: todosQuery.refetch,
    flushQueue,
    retryDeadLetters,
  }
}
