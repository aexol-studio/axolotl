import AsyncStorage from '@react-native-async-storage/async-storage'

import type { TodoItem } from '../../screens/todo/types'

type BaseOperation = {
  id: string
  attempts: number
  createdAt: number
}

export type CreateOperation = BaseOperation & {
  type: 'create'
  payload: {
    content: string
  }
}

export type MarkDoneOperation = BaseOperation & {
  type: 'markDone'
  payload: {
    todoId: string
  }
}

export type OfflineTodoOperation = CreateOperation | MarkDoneOperation

type NewCreateOperation = Omit<CreateOperation, 'id' | 'attempts' | 'createdAt'>
type NewMarkDoneOperation = Omit<
  MarkDoneOperation,
  'id' | 'attempts' | 'createdAt'
>
type NewOfflineTodoOperation = NewCreateOperation | NewMarkDoneOperation

const isCreateOperation = (
  operation: OfflineTodoOperation | NewOfflineTodoOperation,
): operation is CreateOperation => operation.type === 'create'

const isMarkDoneOperation = (
  operation: OfflineTodoOperation | NewOfflineTodoOperation,
): operation is MarkDoneOperation => operation.type === 'markDone'

export type OfflineTodoSnapshot = {
  items: TodoItem[]
  updatedAt: number
}

export type OfflineTodoState = {
  snapshot: OfflineTodoSnapshot | null
  queue: OfflineTodoOperation[]
  deadLetters: OfflineTodoOperation[]
}

const STORAGE_KEY = 'axolotl-mobile-todos-offline-state'
const MAX_QUEUE_SIZE = 100
const MAX_DEAD_LETTERS = 50
export const MAX_SYNC_ATTEMPTS = 3

const defaultState: OfflineTodoState = {
  snapshot: null,
  queue: [],
  deadLetters: [],
}

const parseState = (raw: string | null): OfflineTodoState => {
  if (!raw) {
    return defaultState
  }

  try {
    const parsed = JSON.parse(raw) as Partial<OfflineTodoState>

    return {
      snapshot:
        parsed.snapshot && Array.isArray(parsed.snapshot.items)
          ? {
              items: parsed.snapshot.items,
              updatedAt:
                typeof parsed.snapshot.updatedAt === 'number'
                  ? parsed.snapshot.updatedAt
                  : Date.now(),
            }
          : null,
      queue: Array.isArray(parsed.queue) ? parsed.queue : [],
      deadLetters: Array.isArray(parsed.deadLetters) ? parsed.deadLetters : [],
    }
  } catch {
    return defaultState
  }
}

const persistState = async (state: OfflineTodoState) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const readOfflineTodoState = async () => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY)
  return parseState(raw)
}

export const clearTodoOfflineState = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY)
}

export const saveTodoSnapshot = async (items: TodoItem[]) => {
  const state = await readOfflineTodoState()
  await persistState({
    ...state,
    snapshot: {
      items,
      updatedAt: Date.now(),
    },
  })
}

const dedupeQueue = (queue: OfflineTodoOperation[]) => {
  const unique: OfflineTodoOperation[] = []

  queue.forEach((operation) => {
    if (isCreateOperation(operation)) {
      const content = operation.payload.content
      const alreadyExists = unique.some(
        (existing) =>
          isCreateOperation(existing) &&
          existing.payload.content.trim().toLowerCase() ===
            content.trim().toLowerCase(),
      )

      if (!alreadyExists) {
        unique.push(operation)
      }

      return
    }

    const alreadyExists = unique.some(
      (existing) =>
        isMarkDoneOperation(existing) &&
        existing.payload.todoId === operation.payload.todoId,
    )

    if (!alreadyExists) {
      unique.push(operation)
    }
  })

  return unique.slice(-MAX_QUEUE_SIZE)
}

export const enqueueTodoOperation = async (
  operation: NewOfflineTodoOperation,
) => {
  const state = await readOfflineTodoState()
  let queued: OfflineTodoOperation

  if (operation.type === 'create') {
    queued = {
      type: 'create',
      payload: {
        content: operation.payload.content,
      },
      id: `create-${Date.now()}-${Math.round(Math.random() * 1_000_000)}`,
      createdAt: Date.now(),
      attempts: 0,
    }
  } else {
    queued = {
      type: 'markDone',
      payload: {
        todoId: operation.payload.todoId,
      },
      id: `markDone-${Date.now()}-${Math.round(Math.random() * 1_000_000)}`,
      createdAt: Date.now(),
      attempts: 0,
    }
  }

  const nextQueue = dedupeQueue([...state.queue, queued])

  await persistState({
    ...state,
    queue: nextQueue,
  })

  return queued
}

export const removeQueuedOperation = async (operationId: string) => {
  const state = await readOfflineTodoState()
  await persistState({
    ...state,
    queue: state.queue.filter((operation) => operation.id !== operationId),
  })
}

export const incrementOperationAttempt = async (operationId: string) => {
  const state = await readOfflineTodoState()

  const target = state.queue.find((operation) => operation.id === operationId)
  if (!target) {
    return
  }

  const nextAttempt = target.attempts + 1
  if (nextAttempt >= MAX_SYNC_ATTEMPTS) {
    const deadLetters = [
      ...state.deadLetters,
      { ...target, attempts: nextAttempt },
    ]

    await persistState({
      ...state,
      queue: state.queue.filter((operation) => operation.id !== operationId),
      deadLetters: deadLetters.slice(-MAX_DEAD_LETTERS),
    })

    return
  }

  await persistState({
    ...state,
    queue: state.queue.map((operation) =>
      operation.id === operationId
        ? {
            ...operation,
            attempts: nextAttempt,
          }
        : operation,
    ),
  })
}

export const retryDeadLetters = async () => {
  const state = await readOfflineTodoState()
  if (state.deadLetters.length === 0) {
    return
  }

  const revived = state.deadLetters.map((operation) => ({
    ...operation,
    attempts: 0,
    createdAt: Date.now(),
  }))

  const queue = dedupeQueue([...state.queue, ...revived])

  await persistState({
    ...state,
    queue,
    deadLetters: [],
  })
}

export const applyOfflineOverlay = (
  baseItems: TodoItem[],
  queue: OfflineTodoOperation[],
) => {
  const mapped = baseItems.map((item) => ({ ...item }))

  queue.forEach((operation) => {
    if (isCreateOperation(operation)) {
      const content = operation.payload.content.trim()
      if (!content) {
        return
      }

      const alreadyExists = mapped.some(
        (item) => item.title.trim().toLowerCase() === content.toLowerCase(),
      )
      if (alreadyExists) {
        return
      }

      mapped.unshift({
        id: `offline-${operation.id}`,
        title: content,
        completed: false,
        pendingSync: true,
      })

      return
    }

    if (!isMarkDoneOperation(operation)) {
      return
    }

    const idx = mapped.findIndex((item) => item.id === operation.payload.todoId)
    if (idx === -1) {
      return
    }

    mapped[idx] = {
      ...mapped[idx],
      completed: true,
      pendingSync: true,
    }
  })

  return mapped
}
