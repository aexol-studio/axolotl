import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type OnboardingState = {
  hasHydrated: boolean
  hasCompletedOnboarding: boolean
  hasCompletedSpotlightTour: boolean
  setHydrated: (value: boolean) => void
  completeOnboarding: () => void
  completeSpotlightTour: () => void
  resetOnboarding: () => void
  resetSpotlightTour: () => void
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      hasCompletedOnboarding: false,
      hasCompletedSpotlightTour: false,
      setHydrated: (value) => set({ hasHydrated: value }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      completeSpotlightTour: () => set({ hasCompletedSpotlightTour: true }),
      resetOnboarding: () => set({ hasCompletedOnboarding: false }),
      resetSpotlightTour: () => set({ hasCompletedSpotlightTour: false }),
    }),
    {
      name: 'axolotl-mobile-onboarding',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        hasCompletedSpotlightTour: state.hasCompletedSpotlightTour,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    },
  ),
)
