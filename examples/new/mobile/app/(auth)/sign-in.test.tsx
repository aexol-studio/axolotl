import { fireEvent, render, screen } from '@testing-library/react-native';

import SignInScreen from './sign-in';

describe('app/(auth)/sign-in', () => {
  it('keeps submit disabled for empty email', () => {
    render(<SignInScreen />);

    const submit = screen.getByTestId('auth-submit-btn');
    expect(submit.props.accessibilityState?.disabled).toBe(true);
  });

  it('enables submit when email is provided', () => {
    render(<SignInScreen />);

    const input = screen.getByTestId('auth-email-input');
    fireEvent.changeText(input, 'starter@axolotl.dev');

    const submit = screen.getByTestId('auth-submit-btn');
    expect(submit.props.accessibilityState?.disabled).toBe(false);
  });

  it('switches CTA layout variant to top', () => {
    render(<SignInScreen />);

    fireEvent.press(screen.getByTestId('auth-cta-top-btn'));

    expect(screen.getByTestId('auth-submit-btn')).toBeTruthy();
    expect(screen.getByTestId('auth-form-scaffold')).toBeTruthy();
  });
});
