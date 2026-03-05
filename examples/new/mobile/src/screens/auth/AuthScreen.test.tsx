import { fireEvent, render, screen } from '@testing-library/react-native'

import { AuthScreen } from './AuthScreen'

const mockReplace = jest.fn()
const mockShowToast = jest.fn()
const mockLoginMutateAsync = jest.fn(async () => 'token')
const mockRegisterMutateAsync = jest.fn(async () => 'token')

jest.mock('expo-router', () => ({
  router: {
    replace: mockReplace,
  },
}))

jest.mock('../../providers/ToastProvider', () => ({
  useToast: () => ({
    showToast: (...args: unknown[]) => mockShowToast(...args),
  }),
}))

jest.mock('../../features/auth/useAuthSession', () => ({
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

describe('AuthScreen', () => {
  beforeEach(() => {
    mockReplace.mockClear()
    mockShowToast.mockClear()
    mockLoginMutateAsync.mockClear()
    mockRegisterMutateAsync.mockClear()
  })

  it('submits login in sign-in mode', async () => {
    render(<AuthScreen mode="sign-in" />)

    fireEvent.changeText(
      screen.getByTestId('auth-email-input'),
      'mail@axolotl.dev',
    )
    fireEvent.changeText(screen.getByTestId('auth-password-input'), '123456')
    fireEvent.press(screen.getByTestId('auth-submit-btn'))

    expect(mockLoginMutateAsync).toHaveBeenCalledWith({
      email: 'mail@axolotl.dev',
      password: '123456',
    })
  })

  it('submits register in sign-up mode', async () => {
    render(<AuthScreen mode="sign-up" />)

    fireEvent.changeText(
      screen.getByTestId('auth-email-input'),
      'new@axolotl.dev',
    )
    fireEvent.changeText(screen.getByTestId('auth-password-input'), '123456')
    fireEvent.press(screen.getByTestId('auth-submit-btn'))

    expect(mockRegisterMutateAsync).toHaveBeenCalledWith({
      email: 'new@axolotl.dev',
      password: '123456',
    })
  })
})
