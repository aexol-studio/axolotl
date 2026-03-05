import { render } from '@testing-library/react-native'

import RootLayout from './_layout'
import { useAuthStore } from '../src/stores/authStore'
import { useOnboardingStore } from '../src/stores/onboardingStore'

const { __routerReplaceMock: routerReplaceMock } = jest.requireMock(
  'expo-router',
) as {
  __routerReplaceMock: jest.Mock
}

const { __setSegmentsMock: setSegmentsMock } = jest.requireMock(
  'expo-router',
) as {
  __setSegmentsMock: (segments: string[]) => void
}

describe('app/_layout onboarding gate', () => {
  beforeEach(() => {
    routerReplaceMock.mockClear()
    setSegmentsMock([])
    useOnboardingStore.setState({
      hasHydrated: false,
      hasCompletedOnboarding: false,
      hasCompletedSpotlightTour: false,
    })
    useAuthStore.setState({
      hasHydrated: false,
      accessToken: null,
    })
  })

  it('does not redirect returning users after hydration with completed onboarding', () => {
    useOnboardingStore.setState({
      hasHydrated: true,
      hasCompletedOnboarding: true,
      hasCompletedSpotlightTour: false,
    })
    useAuthStore.setState({
      hasHydrated: true,
      accessToken: 'test-token',
    })

    render(<RootLayout />)

    expect(routerReplaceMock).not.toHaveBeenCalled()
  })

  it('redirects to onboarding when user has not completed onboarding after hydration', () => {
    useOnboardingStore.setState({
      hasHydrated: true,
      hasCompletedOnboarding: false,
      hasCompletedSpotlightTour: false,
    })
    useAuthStore.setState({
      hasHydrated: true,
      accessToken: null,
    })

    render(<RootLayout />)

    expect(routerReplaceMock).toHaveBeenCalledWith('./onboarding')
  })

  it('waits for hydration before making redirect decisions', () => {
    useAuthStore.setState({
      hasHydrated: false,
      accessToken: null,
    })

    render(<RootLayout />)

    expect(routerReplaceMock).not.toHaveBeenCalled()
  })

  it('redirects to sign-in when onboarding is complete and user is not authenticated', () => {
    useOnboardingStore.setState({
      hasHydrated: true,
      hasCompletedOnboarding: true,
      hasCompletedSpotlightTour: false,
    })
    useAuthStore.setState({
      hasHydrated: true,
      accessToken: null,
    })

    render(<RootLayout />)

    expect(routerReplaceMock).toHaveBeenCalledWith('./(auth)/sign-in')
  })

  it('redirects authenticated users away from auth routes to tabs', () => {
    setSegmentsMock(['(auth)', 'sign-in'])
    useOnboardingStore.setState({
      hasHydrated: true,
      hasCompletedOnboarding: true,
      hasCompletedSpotlightTour: false,
    })
    useAuthStore.setState({
      hasHydrated: true,
      accessToken: 'test-token',
    })

    render(<RootLayout />)

    expect(routerReplaceMock).toHaveBeenCalledWith('./(tabs)')
  })

  it('redirects away from onboarding when user already completed it', () => {
    setSegmentsMock(['onboarding'])
    useOnboardingStore.setState({
      hasHydrated: true,
      hasCompletedOnboarding: true,
      hasCompletedSpotlightTour: false,
    })
    useAuthStore.setState({
      hasHydrated: true,
      accessToken: null,
    })

    render(<RootLayout />)

    expect(routerReplaceMock).toHaveBeenCalledWith('./(auth)/sign-in')
  })
})
