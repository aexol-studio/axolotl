import {
  mixpanelTemplateManifest,
  oneSignalTemplateManifest,
  realtimeTemplateManifest,
  sentryTemplateManifest,
} from './index';

describe('integration templates manifests', () => {
  afterEach(() => {
    delete process.env.EXPO_PUBLIC_ENABLE_STARTER_TEMPLATES;
    jest.resetModules();
  });

  it('marks templates as optional and not runtime-installed by default', () => {
    expect(oneSignalTemplateManifest.optional).toBe(true);
    expect(oneSignalTemplateManifest.runtimeInstalledByDefault).toBe(false);
    expect(mixpanelTemplateManifest.optional).toBe(true);
    expect(mixpanelTemplateManifest.runtimeInstalledByDefault).toBe(false);
    expect(sentryTemplateManifest.optional).toBe(true);
    expect(sentryTemplateManifest.runtimeInstalledByDefault).toBe(false);
    expect(realtimeTemplateManifest.optional).toBe(true);
    expect(realtimeTemplateManifest.runtimeInstalledByDefault).toBe(false);
  });

  it('defines onesignal manifest with required fields', () => {
    expect(oneSignalTemplateManifest.id).toBe('integration.onesignal');
    expect(oneSignalTemplateManifest.install).toContain('react-native-onesignal');
    expect(oneSignalTemplateManifest.env).toContain('EXPO_PUBLIC_ONESIGNAL_APP_ID');
    expect(oneSignalTemplateManifest.runtimeGuard).toBe('isOneSignalConfigured()');
    expect(oneSignalTemplateManifest.starterBlueprintPaths).toEqual(
      expect.arrayContaining(['templates/integrations/onesignal/src/provider.tsx']),
    );
  });

  it('defines mixpanel manifest with required fields', () => {
    expect(mixpanelTemplateManifest.id).toBe('integration.mixpanel');
    expect(mixpanelTemplateManifest.install).toContain('mixpanel-react-native');
    expect(mixpanelTemplateManifest.env).toContain('EXPO_PUBLIC_MIXPANEL_TOKEN');
    expect(mixpanelTemplateManifest.runtimeGuard).toBe('isMixpanelConfigured()');
    expect(mixpanelTemplateManifest.starterBlueprintPaths).toEqual(
      expect.arrayContaining(['templates/integrations/mixpanel/src/provider.tsx']),
    );
  });

  it('defines sentry manifest with required fields', () => {
    expect(sentryTemplateManifest.id).toBe('integration.sentry');
    expect(sentryTemplateManifest.install).toContain('@sentry/react-native');
    expect(sentryTemplateManifest.env).toContain('EXPO_PUBLIC_SENTRY_DSN');
    expect(sentryTemplateManifest.runtimeGuard).toBe('isSentryConfigured()');
    expect(sentryTemplateManifest.starterBlueprintPaths).toEqual(
      expect.arrayContaining(['templates/integrations/sentry/src/provider.tsx']),
    );
  });

  it('defines realtime manifest with required fields', () => {
    expect(realtimeTemplateManifest.id).toBe('integration.realtime-pusher');
    expect(realtimeTemplateManifest.install).toContain('pusher-js');
    expect(realtimeTemplateManifest.env).toEqual(
      expect.arrayContaining(['EXPO_PUBLIC_PUSHER_KEY', 'EXPO_PUBLIC_PUSHER_CLUSTER']),
    );
    expect(realtimeTemplateManifest.runtimeGuard).toBe('isRealtimeConfigured()');
    expect(realtimeTemplateManifest.starterBlueprintPaths).toEqual(
      expect.arrayContaining(['templates/integrations/realtime/src/provider.tsx']),
    );
  });

  it('keeps template blueprint runtime wiring disabled by default', () => {
    const { areTemplateBlueprintsEnabled } = require('./index') as typeof import('./index');

    expect(areTemplateBlueprintsEnabled()).toBe(false);
  });
});
