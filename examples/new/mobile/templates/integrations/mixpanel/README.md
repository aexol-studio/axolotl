# Mixpanel Template (Opt-in)

This template is not active by default.

## Install

```bash
npm install mixpanel-react-native
```

## Suggested runtime paths

- `src/config/mixpanel.ts`
- `src/providers/MixpanelProvider.tsx`
- `src/lib/analytics/mixpanelClient.ts`

## Blueprint source files in this template

- `templates/integrations/mixpanel/src/config.ts`
- `templates/integrations/mixpanel/src/client.ts`
- `templates/integrations/mixpanel/src/provider.tsx`
- tests in `templates/integrations/mixpanel/src/*.test.*`

## Baseline architecture

1. `config` file with env guard (`isMixpanelConfigured`)
2. provider that initializes SDK only when configured
3. tiny analytics client wrapper (`track`, `identify`, `setProfile`)
4. no-op wrappers in development/local if key is missing

## Env

- `EXPO_PUBLIC_MIXPANEL_TOKEN`

## Wiring

Add `MixpanelProvider` in `AppProviders` only after dependencies are installed.

Keep it guarded by `isMixpanelConfigured()` and return children when token is absent.

## Test checklist

- no-op behavior when token missing
- track wrapper forwards event and props when enabled
- provider does not block app render on SDK error
