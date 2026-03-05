export const oneSignalTemplateManifest = {
  id: 'integration.onesignal',
  install: ['react-native-onesignal'],
  env: ['EXPO_PUBLIC_ONESIGNAL_APP_ID'],
  starterBlueprintPaths: [
    'templates/integrations/onesignal/src/config.ts',
    'templates/integrations/onesignal/src/setup.ts',
    'templates/integrations/onesignal/src/provider.tsx',
  ],
  optional: true,
  runtimeInstalledByDefault: false,
  runtimeGuard: 'isOneSignalConfigured()',
  runtimeTargets: [
    'src/config/onesignal.ts',
    'src/providers/OneSignalProvider.tsx',
    'src/hooks/notifications/useOneSignalSetup.ts',
  ],
  notes: [
    'Keep integration disabled when app id is not set.',
    'Provider should stay thin and delegate setup to hook.',
  ],
} as const;
