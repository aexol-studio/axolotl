import { fireEvent, render, screen } from '@testing-library/react-native'

import OnboardingRoute from './onboarding'

describe('app/onboarding', () => {
  it('renders pager and reacts to next/skip actions', () => {
    render(<OnboardingRoute />)

    expect(screen.getByTestId('onboarding-screen')).toBeTruthy()
    expect(screen.getByTestId('onboarding-pager')).toBeTruthy()
    expect(screen.getByTestId('onboarding-progress-fill')).toBeTruthy()

    fireEvent.press(screen.getByTestId('onboarding-next-btn'))
    fireEvent.press(screen.getByTestId('onboarding-skip-btn'))

    expect(screen.getByTestId('onboarding-next-btn')).toBeTruthy()
  })
})
