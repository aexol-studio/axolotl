export const mixpanelTemplateManifest = {
  id: 'integration.mixpanel',
  install: ['mixpanel-react-native'],
  env: ['EXPO_PUBLIC_MIXPANEL_TOKEN'],
  starterBlueprintPaths: [
    'templates/integrations/mixpanel/src/config.ts',
    'templates/integrations/mixpanel/src/client.ts',
    'templates/integrations/mixpanel/src/provider.tsx',
  ],
  optional: true,
  runtimeInstalledByDefault: false,
  runtimeGuard: 'isMixpanelConfigured()',
  runtimeTargets: [
    'src/config/mixpanel.ts',
    'src/providers/MixpanelProvider.tsx',
    'src/lib/analytics/mixpanelClient.ts',
  ],
  notes: [
    'Initialize only when token is present.',
    'Expose wrapper functions instead of direct SDK usage in screens.',
  ],
} as const;
