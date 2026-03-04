describe('mixpanel template config', () => {
  afterEach(() => {
    delete process.env.EXPO_PUBLIC_MIXPANEL_TOKEN;
  });

  it('returns disabled when token is missing', () => {
    const { isMixpanelConfigured } = require('./config') as typeof import('./config');

    expect(isMixpanelConfigured()).toBe(false);
  });

  it('returns enabled when token exists', () => {
    process.env.EXPO_PUBLIC_MIXPANEL_TOKEN = 'mixpanel-token';
    const { getMixpanelConfig, isMixpanelConfigured } = require('./config') as typeof import('./config');

    expect(isMixpanelConfigured()).toBe(true);
    expect(getMixpanelConfig().token).toBe('mixpanel-token');
  });
});
