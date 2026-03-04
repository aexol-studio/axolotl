import { Stack } from 'expo-router'

import { AppProviders } from '../src/providers/AppProviders'

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </AppProviders>
  )
}
