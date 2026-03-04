describe('one signal template config', () => {
  afterEach(() => {
    delete process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;
  });

  it('returns disabled when app id is missing', () => {
    const { isOneSignalConfigured } = require('./config') as typeof import('./config');

    expect(isOneSignalConfigured()).toBe(false);
  });

  it('returns enabled when app id exists', () => {
    process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID = 'onesignal-app-id';
    const { getOneSignalConfig, isOneSignalConfigured } = require('./config') as typeof import('./config');

    expect(isOneSignalConfigured()).toBe(true);
    expect(getOneSignalConfig().appId).toBe('onesignal-app-id');
  });
});
