# Mobile Templates

This directory contains optional starter blueprints that are not wired by default.

## Why this exists

- `app/` is for Expo Router entry points
- `src/` is for runtime app implementation
- `templates/` is for opt-in implementation blueprints (copy/adapt when needed)

Do not import templates directly in runtime code unless you explicitly decide to enable a template.

## Included templates

- `integrations/onesignal` - push notifications integration blueprint
- `integrations/mixpanel` - analytics integration blueprint
- `integrations/sentry` - crash/error monitoring integration blueprint
- `integrations/realtime` - realtime integration blueprint (Pusher JS)

Each integration contains blueprint source files under `src/` plus tests. These files are examples to copy into runtime `src/` only when you opt in.

## How to apply a template

1. Read template README.
2. Install listed dependencies.
3. Copy selected files into `src/` paths.
4. Wire provider in `src/providers/AppProviders.tsx`.
5. Add environment variables to `app.config.ts` or Expo config.
6. Add tests for your copied integration files.

## Integration env runbook

- OneSignal: `EXPO_PUBLIC_ONESIGNAL_APP_ID`
- Mixpanel: `EXPO_PUBLIC_MIXPANEL_TOKEN`
- Sentry: `EXPO_PUBLIC_SENTRY_DSN`, optional `EXPO_PUBLIC_SENTRY_ENVIRONMENT`
- Realtime/Pusher JS: `EXPO_PUBLIC_PUSHER_KEY`, `EXPO_PUBLIC_PUSHER_CLUSTER`

All integrations must remain env-guarded and no-op when config is missing.

## Enforced boundary

- `templates/` is never runtime-mounted by default.
- Runtime code in `app/` and `src/` must not import from `templates/`.
- Template manifests expose `optional: true` and `runtimeInstalledByDefault: false` as contract flags.
