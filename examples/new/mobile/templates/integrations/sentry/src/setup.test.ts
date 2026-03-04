import { isSentrySetupInitialized, resetSentrySetup, setupSentry } from './setup';

describe('sentry template setup', () => {
  beforeEach(() => {
    resetSentrySetup();
  });

  it('initializes SDK once', () => {
    const init = jest.fn();

    setupSentry({ init }, { dsn: 'https://dsn', environment: 'development' });
    setupSentry({ init }, { dsn: 'https://dsn', environment: 'development' });

    expect(init).toHaveBeenCalledTimes(1);
    expect(init).toHaveBeenCalledWith({
      dsn: 'https://dsn',
      environment: 'development',
    });
    expect(isSentrySetupInitialized()).toBe(true);
  });
});
