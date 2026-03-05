describe('sentry template config', () => {
  afterEach(() => {
    delete process.env.EXPO_PUBLIC_SENTRY_DSN;
    delete process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT;
  });

  it('returns disabled when DSN is missing', () => {
    const { isSentryConfigured } = require('./config') as typeof import('./config');

    expect(isSentryConfigured()).toBe(false);
  });

  it('returns enabled when DSN exists', () => {
    process.env.EXPO_PUBLIC_SENTRY_DSN = 'https://example@sentry.io/1';
    process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT = 'staging';
    const { getSentryConfig, isSentryConfigured } = require('./config') as typeof import('./config');

    expect(isSentryConfigured()).toBe(true);
    expect(getSentryConfig()).toEqual({
      dsn: 'https://example@sentry.io/1',
      environment: 'staging',
    });
  });
});
