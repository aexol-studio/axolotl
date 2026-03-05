import { fireEvent, render, screen } from '@testing-library/react-native'

import { PrimaryButton } from './PrimaryButton'
import { AppThemeProvider } from '../../theme'

describe('PrimaryButton', () => {
  it('renders label', () => {
    render(
      <PrimaryButton
        testID="primary"
        label="Continue"
        onPress={() => undefined}
      />,
    )

    expect(screen.getByText('Continue')).toBeTruthy()
  })

  it('calls onPress when enabled', () => {
    const onPress = jest.fn()
    render(
      <PrimaryButton testID="primary" label="Continue" onPress={onPress} />,
    )

    fireEvent.press(screen.getByTestId('primary'))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn()
    render(
      <PrimaryButton
        testID="primary"
        label="Continue"
        onPress={onPress}
        disabled
      />,
    )

    fireEvent.press(screen.getByTestId('primary'))

    expect(onPress).not.toHaveBeenCalled()
  })

  it('supports explicit button sizes from config contract', () => {
    render(
      <AppThemeProvider>
        <PrimaryButton
          testID="primary-small"
          label="Small"
          onPress={() => undefined}
          size="sm"
        />
        <PrimaryButton
          testID="primary-large"
          label="Large"
          onPress={() => undefined}
          size="lg"
        />
      </AppThemeProvider>,
    )

    expect(screen.getByTestId('primary-small')).toBeTruthy()
    expect(screen.getByTestId('primary-large')).toBeTruthy()
  })

  it('supports soft variant for chip-like actions', () => {
    render(
      <PrimaryButton
        testID="primary-soft"
        label="Soft"
        onPress={() => undefined}
        variant="soft"
      />,
    )

    expect(screen.getByTestId('primary-soft')).toBeTruthy()
  })

  it('supports outline variant', () => {
    render(
      <PrimaryButton
        testID="primary-outline"
        label="Outline"
        onPress={() => undefined}
        variant="outline"
      />,
    )

    expect(screen.getByTestId('primary-outline')).toBeTruthy()
  })

  it('supports ghost variant', () => {
    render(
      <PrimaryButton
        testID="primary-ghost"
        label="Ghost"
        onPress={() => undefined}
        variant="ghost"
      />,
    )

    expect(screen.getByTestId('primary-ghost')).toBeTruthy()
  })

  it('supports danger variant', () => {
    render(
      <PrimaryButton
        testID="primary-danger"
        label="Danger"
        onPress={() => undefined}
        variant="danger"
      />,
    )

    expect(screen.getByTestId('primary-danger')).toBeTruthy()
  })
})
