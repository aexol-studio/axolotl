import {
  clearTodoOfflineState,
  readOfflineTodoState,
} from '../../features/todo/offlinePersistence'
import { useAuthStore } from '../../stores/authStore'
import { createQueryClient } from './createQueryClient'

describe('createQueryClient', () => {
  beforeEach(async () => {
    useAuthStore.setState({
      hasHydrated: true,
      accessToken: 'test-token',
      logoutReason: null,
    })
    await clearTodoOfflineState()
  })

  it('creates query client with starter defaults', () => {
    const client = createQueryClient()

    const defaults = client.getDefaultOptions()
    expect(defaults.queries?.staleTime).toBe(30_000)
    expect(defaults.queries?.retry).toBe(1)
    expect(defaults.queries?.refetchOnReconnect).toBe(true)
    expect(defaults.mutations?.retry).toBe(0)
  })

  it('clears auth session on auth invalidation query error', async () => {
    const client = createQueryClient()

    await client
      .fetchQuery({
        queryKey: ['sample-auth-invalidation'],
        queryFn: async () => {
          throw new Error('UNAUTHENTICATED: token expired')
        },
      })
      .catch(() => undefined)

    expect(useAuthStore.getState().accessToken).toBeNull()
    expect(useAuthStore.getState().logoutReason).toBe('invalidated')

    const offlineState = await readOfflineTodoState()
    expect(offlineState.queue).toHaveLength(0)
  })
})
