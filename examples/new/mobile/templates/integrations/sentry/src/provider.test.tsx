import { render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { SentryTemplateProvider } from './provider';
import { resetSentrySetup } from './setup';

describe('SentryTemplateProvider', () => {
  beforeEach(() => {
    resetSentrySetup();
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_SENTRY_DSN;
    delete process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT;
    jest.clearAllMocks();
  });

  it('renders children and skips setup when DSN is missing', async () => {
    const init = jest.fn();

    render(
      <SentryTemplateProvider sdk={{ init }}>
        <Text>Sentry child</Text>
      </SentryTemplateProvider>,
    );

    expect(screen.getByText('Sentry child')).toBeTruthy();
    await waitFor(() => expect(init).not.toHaveBeenCalled());
  });

  it('initializes setup when DSN exists', async () => {
    process.env.EXPO_PUBLIC_SENTRY_DSN = 'https://example@sentry.io/1';
    process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT = 'staging';
    const init = jest.fn();

    render(
      <SentryTemplateProvider sdk={{ init }}>
        <Text>Configured Sentry child</Text>
      </SentryTemplateProvider>,
    );

    await waitFor(() =>
      expect(init).toHaveBeenCalledWith({
        dsn: 'https://example@sentry.io/1',
        environment: 'staging',
      }),
    );
  });
});
