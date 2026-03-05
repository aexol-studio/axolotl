import { router } from 'expo-router'

import { OnboardingScreen } from '../src/screens/onboarding/OnboardingScreen'

export default function OnboardingRoute() {
  return (
    <OnboardingScreen
      onFinish={() => {
        router.replace('./(tabs)')
      }}
    />
  )
}
