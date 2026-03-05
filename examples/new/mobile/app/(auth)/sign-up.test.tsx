import { fireEvent, render, screen } from '@testing-library/react-native'

import SignUpRoute from './sign-up'

const mockLoginMutateAsync = jest.fn(async () => 'token')
const mockRegisterMutateAsync = jest.fn(async () => 'token')

jest.mock('../../src/features/auth/useAuthSession', () => ({
  useAuthSession: () => ({
    loginMutation: {
      isPending: false,
      mutateAsync: mockLoginMutateAsync,
    },
    registerMutation: {
      isPending: false,
      mutateAsync: mockRegisterMutateAsync,
    },
  }),
}))

describe('app/(auth)/sign-up', () => {
  it('keeps submit disabled until valid email and password are provided', () => {
    render(<SignUpRoute />)

    const submit = screen.getByTestId('auth-submit-btn')
    expect(submit.props.accessibilityState?.disabled).toBe(true)

    fireEvent.changeText(
      screen.getByTestId('auth-email-input'),
      'new@axolotl.dev',
    )
    fireEvent.changeText(screen.getByTestId('auth-password-input'), '12345')

    expect(
      screen.getByTestId('auth-submit-btn').props.accessibilityState?.disabled,
    ).toBe(true)

    fireEvent.changeText(screen.getByTestId('auth-password-input'), '123456')

    expect(
      screen.getByTestId('auth-submit-btn').props.accessibilityState?.disabled,
    ).toBe(false)
  })

  it('shows auth mode switch action back to sign in', () => {
    render(<SignUpRoute />)

    expect(screen.getByTestId('auth-go-sign-in-btn')).toBeTruthy()
  })
})
