import {
  applyOfflineOverlay,
  MAX_SYNC_ATTEMPTS,
  enqueueTodoOperation,
  incrementOperationAttempt,
  readOfflineTodoState,
  removeQueuedOperation,
  retryDeadLetters,
  saveTodoSnapshot,
  clearTodoOfflineState,
} from './offlinePersistence'

describe('offlinePersistence', () => {
  beforeEach(async () => {
    await clearTodoOfflineState()
  })

  it('stores snapshot and overlays queued operations', async () => {
    await saveTodoSnapshot([
      {
        id: 'a',
        title: 'Existing todo',
        completed: false,
      },
    ])

    await enqueueTodoOperation({
      type: 'create',
      payload: {
        content: 'Offline todo',
      },
    })

    await enqueueTodoOperation({
      type: 'markDone',
      payload: {
        todoId: 'a',
      },
    })

    const state = await readOfflineTodoState()
    const projected = applyOfflineOverlay(
      state.snapshot?.items ?? [],
      state.queue,
    )

    expect(projected[0]?.title).toBe('Offline todo')
    expect(projected[0]?.pendingSync).toBe(true)
    expect(projected.find((item) => item.id === 'a')?.completed).toBe(true)
  })

  it('moves operation to dead letters after max retries', async () => {
    const queued = await enqueueTodoOperation({
      type: 'create',
      payload: {
        content: 'Needs retry',
      },
    })

    for (let index = 0; index < MAX_SYNC_ATTEMPTS; index += 1) {
      await incrementOperationAttempt(queued.id)
    }

    const state = await readOfflineTodoState()
    expect(state.queue).toHaveLength(0)
    expect(state.deadLetters).toHaveLength(1)
  })

  it('can revive dead letters back to queue', async () => {
    const queued = await enqueueTodoOperation({
      type: 'markDone',
      payload: {
        todoId: 'seed-id',
      },
    })

    for (let index = 0; index < MAX_SYNC_ATTEMPTS; index += 1) {
      await incrementOperationAttempt(queued.id)
    }

    await retryDeadLetters()

    const state = await readOfflineTodoState()
    expect(state.deadLetters).toHaveLength(0)
    expect(state.queue).toHaveLength(1)
  })

  it('removes queue entry by id', async () => {
    const queued = await enqueueTodoOperation({
      type: 'create',
      payload: {
        content: 'Delete me',
      },
    })

    await removeQueuedOperation(queued.id)

    const state = await readOfflineTodoState()
    expect(state.queue).toHaveLength(0)
  })
})
