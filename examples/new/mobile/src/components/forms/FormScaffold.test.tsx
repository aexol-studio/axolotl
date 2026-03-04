import { fireEvent, render, screen } from '@testing-library/react-native';

import { FormScaffold } from './FormScaffold';
import { AppText } from '../primitives/AppText';

describe('FormScaffold', () => {
  it('renders top CTA variant and triggers submit', () => {
    const onCtaPress = jest.fn();

    render(
      <FormScaffold
        testID="auth-form-top"
        ctaVariant="top"
        ctaLabel="Continue"
        ctaTestID="auth-form-top-submit-btn"
        onCtaPress={onCtaPress}
      >
        <AppText>Field</AppText>
      </FormScaffold>,
    );

    fireEvent.press(screen.getByTestId('auth-form-top-submit-btn'));
    expect(onCtaPress).toHaveBeenCalledTimes(1);
  });

  it('renders sticky CTA variant', () => {
    render(
      <FormScaffold
        testID="auth-form-sticky"
        ctaVariant="sticky"
        ctaLabel="Continue"
        ctaTestID="auth-form-sticky-submit-btn"
        onCtaPress={() => undefined}
      >
        <AppText>Field</AppText>
      </FormScaffold>,
    );

    expect(screen.getByTestId('auth-form-sticky-submit-btn')).toBeTruthy();
  });

  it('uses keyboard-aware scaffold wrapper', () => {
    const { getByTestId } = render(
      <FormScaffold
        testID="auth-form-keyboard"
        ctaVariant="sticky"
        ctaLabel="Continue"
        ctaTestID="auth-form-keyboard-submit-btn"
        onCtaPress={() => undefined}
      >
        <AppText>Field</AppText>
      </FormScaffold>,
    );

    const scaffold = getByTestId('auth-form-keyboard');

    expect(scaffold).toBeTruthy();
    expect(scaffold.props.bottomOffset).toBe(14);
    expect(scaffold.props.keyboardShouldPersistTaps).toBe('handled');
    expect(screen.getByTestId('auth-form-keyboard-sticky-footer')).toBeTruthy();
  });

  it('keeps sticky footer hidden when top CTA variant is selected', () => {
    render(
      <FormScaffold
        testID="auth-form-top-keyboard"
        ctaVariant="top"
        ctaLabel="Continue"
        ctaTestID="auth-form-top-keyboard-submit-btn"
        onCtaPress={() => undefined}
      >
        <AppText>Field</AppText>
      </FormScaffold>,
    );

    expect(screen.queryByTestId('auth-form-top-keyboard-sticky-footer')).toBeNull();
  });
});
