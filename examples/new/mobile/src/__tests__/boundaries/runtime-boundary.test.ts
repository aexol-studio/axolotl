import {
  mixpanelTemplateManifest,
  oneSignalTemplateManifest,
  realtimeTemplateManifest,
  sentryTemplateManifest,
} from '../../../templates/integrations';

describe('runtime/template boundaries', () => {
  it('declares template integrations as optional starter blueprints', () => {
    expect(mixpanelTemplateManifest.optional).toBe(true);
    expect(oneSignalTemplateManifest.optional).toBe(true);
    expect(sentryTemplateManifest.optional).toBe(true);
    expect(realtimeTemplateManifest.optional).toBe(true);
    expect(mixpanelTemplateManifest.runtimeInstalledByDefault).toBe(false);
    expect(oneSignalTemplateManifest.runtimeInstalledByDefault).toBe(false);
    expect(sentryTemplateManifest.runtimeInstalledByDefault).toBe(false);
    expect(realtimeTemplateManifest.runtimeInstalledByDefault).toBe(false);
  });

  it('does not require template-only env vars for default runtime', () => {
    expect(process.env.EXPO_PUBLIC_MIXPANEL_TOKEN).toBeUndefined();
    expect(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID).toBeUndefined();
  });
});
