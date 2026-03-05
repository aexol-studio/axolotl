# OneSignal Template (Opt-in)

This template is not active by default.

## Install

```bash
npm install react-native-onesignal
```

## Suggested runtime paths

- `src/config/onesignal.ts`
- `src/providers/OneSignalProvider.tsx`
- `src/hooks/notifications/useOneSignalSetup.ts`

## Blueprint source files in this template

- `templates/integrations/onesignal/src/config.ts`
- `templates/integrations/onesignal/src/setup.ts`
- `templates/integrations/onesignal/src/provider.tsx`
- tests in `templates/integrations/onesignal/src/*.test.*`

## Baseline architecture

Use the same integration shape as proven in other mobile projects:

1. `config` file with env guard (`isOneSignalConfigured`)
2. thin provider component that only mounts setup hook
3. setup hook for SDK init, register/unregister lifecycle, and identity sync
4. graceful no-op when env is missing

## Env

- `EXPO_PUBLIC_ONESIGNAL_APP_ID`

## Wiring

Wrap app content in `OneSignalProvider` inside `AppProviders` only after dependencies are installed.

Keep runtime guarded by `isOneSignalConfigured()` so default starter behavior remains unchanged.

## Test checklist

- provider renders children
- setup hook is not executed when config is missing
- register/unregister flow on auth changes
