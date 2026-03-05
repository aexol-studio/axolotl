import { mixpanelTemplateManifest } from './mixpanel/manifest';
import { oneSignalTemplateManifest } from './onesignal/manifest';
import { realtimeTemplateManifest } from './realtime/manifest';
import { sentryTemplateManifest } from './sentry/manifest';

describe('integration blueprint boundaries', () => {
  it('contains blueprint source files for both integrations', () => {
    expect(mixpanelTemplateManifest.starterBlueprintPaths).toEqual(
      expect.arrayContaining([
        'templates/integrations/mixpanel/src/config.ts',
        'templates/integrations/mixpanel/src/provider.tsx',
      ]),
    );

    expect(oneSignalTemplateManifest.starterBlueprintPaths).toEqual(
      expect.arrayContaining([
        'templates/integrations/onesignal/src/config.ts',
        'templates/integrations/onesignal/src/provider.tsx',
      ]),
    );

    expect(sentryTemplateManifest.starterBlueprintPaths).toEqual(
      expect.arrayContaining([
        'templates/integrations/sentry/src/config.ts',
        'templates/integrations/sentry/src/provider.tsx',
      ]),
    );

    expect(realtimeTemplateManifest.starterBlueprintPaths).toEqual(
      expect.arrayContaining([
        'templates/integrations/realtime/src/config.ts',
        'templates/integrations/realtime/src/provider.tsx',
      ]),
    );
  });

  it('keeps templates opt-in only', () => {
    expect(mixpanelTemplateManifest.runtimeInstalledByDefault).toBe(false);
    expect(oneSignalTemplateManifest.runtimeInstalledByDefault).toBe(false);
    expect(sentryTemplateManifest.runtimeInstalledByDefault).toBe(false);
    expect(realtimeTemplateManifest.runtimeInstalledByDefault).toBe(false);
  });
});
