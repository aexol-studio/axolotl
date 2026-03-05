import { useAuthStore } from './authStore'

describe('authStore', () => {
  afterEach(() => {
    useAuthStore.setState({
      hasHydrated: false,
      accessToken: null,
      logoutReason: null,
    })
  })

  it('starts with session cleared', () => {
    expect(useAuthStore.getState().accessToken).toBeNull()
    expect(Boolean(useAuthStore.getState().accessToken)).toBe(false)
  })

  it('updates token and auth state', () => {
    useAuthStore.getState().setAccessToken('demo-token')

    expect(useAuthStore.getState().accessToken).toBe('demo-token')
    expect(useAuthStore.getState().logoutReason).toBeNull()
    expect(Boolean(useAuthStore.getState().accessToken)).toBe(true)
  })

  it('clears token on logout action', () => {
    useAuthStore.setState({
      hasHydrated: true,
      accessToken: 'demo-token',
      logoutReason: 'manual',
    })

    useAuthStore.getState().clearSession()

    expect(useAuthStore.getState().accessToken).toBeNull()
    expect(useAuthStore.getState().logoutReason).toBeNull()
  })

  it('sets logout reason explicitly', () => {
    useAuthStore.getState().setLogoutReason('invalidated')

    expect(useAuthStore.getState().logoutReason).toBe('invalidated')
  })
})
