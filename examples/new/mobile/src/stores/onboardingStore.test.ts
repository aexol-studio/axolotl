import { useOnboardingStore } from './onboardingStore'

describe('onboardingStore', () => {
  afterEach(() => {
    useOnboardingStore.setState({
      hasHydrated: false,
      hasCompletedOnboarding: false,
      hasCompletedSpotlightTour: false,
    })
  })

  it('resets onboarding and spotlight together', () => {
    useOnboardingStore.setState({
      hasHydrated: true,
      hasCompletedOnboarding: true,
      hasCompletedSpotlightTour: true,
    })

    useOnboardingStore.getState().resetOnboarding()
    useOnboardingStore.getState().resetSpotlightTour()

    expect(useOnboardingStore.getState().hasCompletedOnboarding).toBe(false)
    expect(useOnboardingStore.getState().hasCompletedSpotlightTour).toBe(false)
  })

  it('starts with hydration disabled until rehydration completes', () => {
    useOnboardingStore.setState({
      hasHydrated: false,
      hasCompletedOnboarding: false,
      hasCompletedSpotlightTour: false,
    })

    expect(useOnboardingStore.getState().hasHydrated).toBe(false)

    useOnboardingStore.getState().setHydrated(true)

    expect(useOnboardingStore.getState().hasHydrated).toBe(true)
  })

  it('completes onboarding flag', () => {
    useOnboardingStore.getState().completeOnboarding()

    expect(useOnboardingStore.getState().hasCompletedOnboarding).toBe(true)
  })

  it('completes spotlight flag', () => {
    useOnboardingStore.getState().completeSpotlightTour()

    expect(useOnboardingStore.getState().hasCompletedSpotlightTour).toBe(true)
  })

  it('resets flags', () => {
    useOnboardingStore.getState().completeOnboarding()
    useOnboardingStore.getState().completeSpotlightTour()

    useOnboardingStore.getState().resetOnboarding()
    useOnboardingStore.getState().resetSpotlightTour()

    expect(useOnboardingStore.getState().hasCompletedOnboarding).toBe(false)
    expect(useOnboardingStore.getState().hasCompletedSpotlightTour).toBe(false)
  })
})
