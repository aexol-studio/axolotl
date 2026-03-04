# Sentry Template (Opt-in)

This template is not active by default.

## Install

```bash
npm install @sentry/react-native
```

## Suggested runtime paths

- `src/config/sentry.ts`
- `src/providers/SentryProvider.tsx`
- `src/lib/monitoring/sentrySetup.ts`

## Blueprint source files in this template

- `templates/integrations/sentry/src/config.ts`
- `templates/integrations/sentry/src/setup.ts`
- `templates/integrations/sentry/src/provider.tsx`
- tests in `templates/integrations/sentry/src/*.test.*`

## Baseline architecture

1. `config` with env guard (`isSentryConfigured`)
2. setup module with idempotent initialization
3. thin provider that calls setup safely and never blocks rendering

## Env

- `EXPO_PUBLIC_SENTRY_DSN`
- `EXPO_PUBLIC_SENTRY_ENVIRONMENT` (optional, defaults to `development`)

## Wiring

Add `SentryProvider` in `AppProviders` only after dependencies are installed and files are copied into runtime `src/`.

Keep runtime guarded by `isSentryConfigured()` so default starter behavior remains unchanged.
