export const realtimeTemplateManifest = {
  id: 'integration.realtime-pusher',
  install: ['pusher-js'],
  env: ['EXPO_PUBLIC_PUSHER_KEY', 'EXPO_PUBLIC_PUSHER_CLUSTER'],
  starterBlueprintPaths: [
    'templates/integrations/realtime/src/config.ts',
    'templates/integrations/realtime/src/client.ts',
    'templates/integrations/realtime/src/provider.tsx',
  ],
  optional: true,
  runtimeInstalledByDefault: false,
  runtimeGuard: 'isRealtimeConfigured()',
  runtimeTargets: [
    'src/config/realtime.ts',
    'src/providers/RealtimeProvider.tsx',
    'src/lib/realtime/pusherClient.ts',
  ],
  notes: [
    'JS-first blueprint uses pusher-js to stay managed-Expo compatible.',
    'Keep subscription setup optional and env-guarded.',
  ],
} as const;
