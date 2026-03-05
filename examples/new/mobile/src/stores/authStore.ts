import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type AuthState = {
  hasHydrated: boolean
  accessToken: string | null
  logoutReason: 'manual' | 'invalidated' | null
  setHydrated: (value: boolean) => void
  setAccessToken: (value: string | null) => void
  setLogoutReason: (value: 'manual' | 'invalidated' | null) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      accessToken: null,
      logoutReason: null,
      setHydrated: (value) => set({ hasHydrated: value }),
      setAccessToken: (value) =>
        set({ accessToken: value, logoutReason: null }),
      setLogoutReason: (value) => set({ logoutReason: value }),
      clearSession: () => set({ accessToken: null, logoutReason: null }),
    }),
    {
      name: 'axolotl-mobile-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        logoutReason: state.logoutReason,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    },
  ),
)

export const useIsAuthenticated = () =>
  useAuthStore((state) => Boolean(state.accessToken))
