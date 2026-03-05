import { PropsWithChildren, Suspense } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { KeyboardProvider } from 'react-native-keyboard-controller'

import { useSettingsStore } from '../stores/settingsStore'
import { SpotlightProvider } from '../features/spotlight/SpotlightContext'
import { useScreenProfile } from '../hooks/useScreenProfile'
import { AppThemeProvider } from '../theme'
import { AppSuspenseFallback } from './AppSuspenseFallback'
import { ToastProvider } from './ToastProvider'
import { composeProviders, type ProviderSlot } from './composeProviders'
import { QueryProvider } from './QueryProvider'
import { RuntimeInitProvider } from './RuntimeInitProvider'

type AppProvidersProps = PropsWithChildren<{
  integrationSlots?: readonly ProviderSlot[]
}>

const CoreSafeAreaProvider: ProviderSlot = {
  id: 'core.safeArea',
  Provider: SafeAreaProvider,
}

const CoreRuntimeInitProvider: ProviderSlot = {
  id: 'core.runtimeInit',
  Provider: RuntimeInitProvider,
}

const CoreSuspenseBoundaryProvider: ProviderSlot = {
  id: 'core.suspenseBoundary',
  Provider: ({ children: providerChildren }) => (
    <Suspense fallback={<AppSuspenseFallback />}>{providerChildren}</Suspense>
  ),
}

const CoreKeyboardProvider: ProviderSlot = {
  id: 'core.keyboardController',
  Provider: ({ children: providerChildren }) => (
    <KeyboardProvider>{providerChildren}</KeyboardProvider>
  ),
}

const CoreSpotlightProvider: ProviderSlot = {
  id: 'core.spotlight',
  Provider: SpotlightProvider,
}

export function AppProviders({
  children,
  integrationSlots = [],
}: AppProvidersProps) {
  const themeMode = useSettingsStore((state) => state.themeMode)
  const uiScale = useSettingsStore((state) => state.uiScale)
  const { screenProfile, viewportRatio } = useScreenProfile()

  const CoreThemeProvider: ProviderSlot = {
    id: 'core.theme',
    Provider: ({ children: providerChildren }) => (
      <AppThemeProvider
        mode={themeMode}
        scale={uiScale}
        screenProfile={screenProfile}
        viewportRatio={viewportRatio}
      >
        {providerChildren}
      </AppThemeProvider>
    ),
  }

  const CoreQueryProvider: ProviderSlot = {
    id: 'core.query',
    Provider: QueryProvider,
  }

  const CoreToastProvider: ProviderSlot = {
    id: 'core.toast',
    Provider: ToastProvider,
  }

  const ComposedProviders = composeProviders([
    CoreSafeAreaProvider,
    CoreRuntimeInitProvider,
    CoreKeyboardProvider,
    CoreThemeProvider,
    CoreSuspenseBoundaryProvider,
    CoreSpotlightProvider,
    ...integrationSlots,
    CoreQueryProvider,
    CoreToastProvider,
  ])

  return <ComposedProviders>{children}</ComposedProviders>
}
