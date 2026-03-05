import { Stack, router, useSegments } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

import { AppProviders } from '../src/providers/AppProviders'
import { useIsAuthenticated, useAuthStore } from '../src/stores/authStore'
import { useOnboardingStore } from '../src/stores/onboardingStore'

export default function RootLayout() {
  const { t } = useTranslation()
  const hasCompletedOnboarding = useOnboardingStore(
    (state) => state.hasCompletedOnboarding,
  )
  const hasHydratedOnboarding = useOnboardingStore((state) => state.hasHydrated)
  const hasHydratedAuth = useAuthStore((state) => state.hasHydrated)
  const isAuthenticated = useIsAuthenticated()
  const segments = useSegments()

  useEffect(() => {
    if (!hasHydratedOnboarding || !hasHydratedAuth) {
      return
    }

    const isOnboardingRoute = segments[0] === 'onboarding'
    const isAuthRoute = segments[0] === '(auth)'

    if (!hasCompletedOnboarding && !isOnboardingRoute) {
      router.replace('./onboarding')
      return
    }

    if (hasCompletedOnboarding && isOnboardingRoute) {
      router.replace(isAuthenticated ? './(tabs)' : './(auth)/sign-in')
      return
    }

    if (!hasCompletedOnboarding) {
      return
    }

    if (!isAuthenticated && !isAuthRoute) {
      router.replace('./(auth)/sign-in')
      return
    }

    if (isAuthenticated && isAuthRoute) {
      router.replace('./(tabs)')
    }
  }, [
    hasCompletedOnboarding,
    hasHydratedOnboarding,
    hasHydratedAuth,
    isAuthenticated,
    segments,
  ])

  return (
    <AppProviders>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: true,
            title: t('common.onboarding.title'),
          }}
        />
      </Stack>
    </AppProviders>
  )
}
