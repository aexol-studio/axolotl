export const sentryTemplateManifest = {
  id: 'integration.sentry',
  install: ['@sentry/react-native'],
  env: ['EXPO_PUBLIC_SENTRY_DSN'],
  starterBlueprintPaths: [
    'templates/integrations/sentry/src/config.ts',
    'templates/integrations/sentry/src/setup.ts',
    'templates/integrations/sentry/src/provider.tsx',
  ],
  optional: true,
  runtimeInstalledByDefault: false,
  runtimeGuard: 'isSentryConfigured()',
  runtimeTargets: [
    'src/config/sentry.ts',
    'src/providers/SentryProvider.tsx',
    'src/lib/monitoring/sentrySetup.ts',
  ],
  notes: [
    'Initialize Sentry only when DSN is configured.',
    'Keep integration fail-safe and no-op in starter baseline.',
  ],
} as const;
