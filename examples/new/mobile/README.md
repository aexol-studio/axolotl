# Axolotl Mobile Starter

Expo Router starter for the user app in `examples/new/mobile`.

This is intentionally a starter kit: reusable building blocks, templates, and skills.
It is not a complete app implementation.

## Stack

- Expo SDK 54 + React Native + TypeScript
- Expo Router (file-based routing)
- React Query (`@tanstack/react-query`)
- Zustand (local app state)
- Zeus (GraphQL client contract)
- i18next + react-i18next

## Required Skills (Mobile)

Before implementing new mobile work, check and use:

- `.opencode/skills/mobile-starter-architecture/SKILL.md`
- `.opencode/skills/mobile-routing-expo-router/SKILL.md`
- `.opencode/skills/mobile-components/SKILL.md`
- `.opencode/skills/mobile-graphql-react-query-zeus/SKILL.md`
- `.opencode/skills/mobile-i18n-dev-translate/SKILL.md`

## Quick Start

```bash
cd mobile
npm install
npm run start
```

## Expo Config

- Project uses typed Expo config in `app.config.ts`.
- Validate resolved public config with:

```bash
npx expo config --type public
```

## Starter Structure

```text
mobile/
  app/                      # Expo Router entry routes and groups (entry layer)
  src/                      # Runtime app implementation (installed and used)
    components/             # Reusable native UI primitives
    templates/              # Runtime screen composition templates
    features/               # Domain hooks and modules
    lib/
      graphql/              # React Query + Zeus integration points
      i18n/                 # i18n config and dev-translate behavior
    providers/              # Root providers
    stores/                 # Zustand stores
    theme/                  # Theme tokens + provider
    zeus/                   # Generated Zeus client (placeholder in starter)
  templates/                # Optional blueprints (NOT active by default)
    integrations/
      onesignal/            # Opt-in setup template + manifest
      mixpanel/             # Opt-in setup template + manifest
```

## app vs src vs templates

- `app/`: route entry files only (thin files, no heavy business logic).
- `src/`: actual runtime code used by the app.
- `templates/`: opt-in implementation blueprints that are not mounted by default and should be copied/wired only when needed.

## Architecture Hardening (Starter Baseline)

This starter now uses a hardened baseline while keeping lightweight starter philosophy:

- **i18n JSON-first**: translations are sourced from `src/lib/i18n/resources/**/common.json`.
  Existing key paths stay backward-compatible (`common.*`).
- **Thin route entries**: `app/**` keeps route wiring only.
  UI composition lives in `src/screens/**`.
- **State-view split**: loading/error/empty/success blocks are reusable primitives under `src/components/state/**`.
- **Error normalization + toast**:
  - shared normalizer: `src/lib/errors/normalizeError.ts`
  - global toast provider: `src/providers/ToastProvider.tsx`
- **Central UI config**: one source of truth in `src/config/mainConfig.ts` for scalable sizes/typography profiles.
- **Theme tokens expanded**:
  - semantic palette and fixed heights/radii in `src/theme/tokens.ts`
  - token-first shadow presets (`boxShadow`) via `mainConfig.components.shadowPresets` and `theme.shadows.*`
  - scale-aware theme creation through settings store (`uiScale`) and runtime screen profile (`phoneCompact`, `phone`, `tablet`).
  - ratio-aware scaling contract (`useWindowDimensions` -> viewport ratio with clamp) wired into theme creation.
- **React Suspense-ready runtime**:
  - core suspense boundary in provider composition with starter fallback via `LoadingState`
  - safe fallback keeps first render resilient while async runtime init completes.

### Starter Philosophy (preserved)

- Reusable klocki first (primitives/templates/providers/hooks).
- Route layer stays thin.
- No heavy business logic in starter screens.

## Extension Runbook

Use this flow for new screens/features:

1. Add route entry file in `app/**` that only renders a screen from `src/screens/**`.
2. Build UI from existing primitives:
   - `AppScreen`, `AppText`, `AppInput`, `PrimaryButton`, `AppListItem`
   - `LoadingState`, `ErrorState`, `EmptyState`
3. Use `useStateView` to drive loading/error/empty/success UI.
4. Normalize unknown errors with `normalizeError()` and show feedback with `useToast().showToast()`.
5. Keep all component sizes from central config + theme tokens (avoid hardcoded heights for input/button/list rows).
   Sizes are also profile-aware (compact phone vs regular phone vs tablet), so avoid one-size-for-all assumptions.
   Use ratio-aware helpers from `mainConfig.ts` instead of ad-hoc viewport multipliers.
6. Keep all interactive elements with explicit `testID`.
7. Validate with:
   - `npm run test`
   - `npm run tsc`
   - `npm run lint`

## Optional Integrations (Template-only)

Template integrations are intentionally not installed in starter runtime.

Use this exact runbook for each integration:

1. Read `templates/README.md` and the selected template README.
2. Install dependency:
   - Mixpanel: `npm install mixpanel-react-native`
   - OneSignal: `npm install react-native-onesignal`
3. Copy blueprint files from template to runtime:
   - Mixpanel:
     - `templates/integrations/mixpanel/src/config.ts` -> `src/config/mixpanel.ts`
     - `templates/integrations/mixpanel/src/client.ts` -> `src/lib/analytics/mixpanelClient.ts`
     - `templates/integrations/mixpanel/src/provider.tsx` -> `src/providers/MixpanelProvider.tsx`
   - OneSignal:
     - `templates/integrations/onesignal/src/config.ts` -> `src/config/onesignal.ts`
     - `templates/integrations/onesignal/src/setup.ts` -> `src/hooks/notifications/useOneSignalSetup.ts`
     - `templates/integrations/onesignal/src/provider.tsx` -> `src/providers/OneSignalProvider.tsx`
4. Add env variables in Expo config/.env:
   - `EXPO_PUBLIC_MIXPANEL_TOKEN=...`
   - `EXPO_PUBLIC_ONESIGNAL_APP_ID=...`
5. Keep env guards in copied code (`isMixpanelConfigured`, `isOneSignalConfigured`) so runtime stays no-op when env is missing.
6. Wire providers in `src/providers/AppProviders.tsx` only after copied files compile.
7. Add or copy tests from template `src/*.test.*` files into your runtime locations.
8. Re-run `npm run test`, `npm run tsc`, and `npm run lint`.

Important: template code remains optional blueprint code under `templates/` and is not mounted in runtime by default.

### Additional template runbooks

- Sentry (opt-in)
  1. Install: `npm install @sentry/react-native`
  2. Copy:
     - `templates/integrations/sentry/src/config.ts` -> `src/config/sentry.ts`
     - `templates/integrations/sentry/src/setup.ts` -> `src/lib/monitoring/sentrySetup.ts`
     - `templates/integrations/sentry/src/provider.tsx` -> `src/providers/SentryProvider.tsx`
  3. Env:
     - `EXPO_PUBLIC_SENTRY_DSN=...`
     - `EXPO_PUBLIC_SENTRY_ENVIRONMENT=staging` (optional)
  4. Wire provider in `AppProviders` integration slots only when env guard passes.

- Realtime (Pusher JS opt-in)
  1. Install: `npm install pusher-js`
  2. Copy:
     - `templates/integrations/realtime/src/config.ts` -> `src/config/realtime.ts`
     - `templates/integrations/realtime/src/client.ts` -> `src/lib/realtime/pusherClient.ts`
     - `templates/integrations/realtime/src/provider.tsx` -> `src/providers/RealtimeProvider.tsx`
  3. Env:
     - `EXPO_PUBLIC_PUSHER_KEY=...`
     - `EXPO_PUBLIC_PUSHER_CLUSTER=...`
  4. Wire provider in `AppProviders` integration slots only when env guard passes.

Provider wiring note (starter baseline): keep core runtime providers always mounted, and add optional integrations as env-guarded slots.

## Theme Init (Baseline)

- Tokens: `src/theme/tokens.ts`
- Theme context/provider: `src/theme/theme.tsx`
- Base init contract: `initThemeBase()` creates and caches the default starter theme
- Hardening contract: `initThemeBase()` is idempotent and fail-safe (falls back to token theme if startup factory throws)
- Mounted at root in `src/providers/AppProviders.tsx`
- Current starter supports `light` and `dark` modes from settings store.

## Ratio Scaling Contract (Architecture)

Starter uses a reusable ratio contract designed for starter portability:

1. **Base viewport + clamp in config**
   - `src/config/mainConfig.ts`
   - `baseViewport: { width: 390, height: 844 }`
   - `viewportRatioClamp: { min: 0.9, max: 1.2 }`

2. **Runtime ratio from `useWindowDimensions`**
   - `useScreenProfile()` returns `{ screenProfile, viewportRatio }`
   - `viewportRatio = clamp(min(width/baseWidth, height/baseHeight))`

3. **Central scaling helpers only**
   - `getComponentMetrics(scale, profile, viewportRatio)`
   - `getButtonMetrics(scale, profile, viewportRatio)`
   - `getTypographyMetrics(scale, profile, viewportRatio)`
   - `getSpacingMultiplier(scale, profile, viewportRatio)`

4. **Explicit button size contract**
   - config supports multiple button sizes (`sm|md|lg`)
   - each size must define explicit metrics (`height`, `horizontalPadding`, `borderRadius`)
   - primitives consume this map (e.g. `PrimaryButton size="sm" | "md" | "lg"`)

5. **No ad-hoc spacing/layout literals in touched files**
   - use `spacing.*` and `layout.justify.*` from theme/tokens
   - avoid hardcoded `gap`/`justifyContent` literals when tokenized alternatives exist

6. **Single scale path (no double scaling)**
   - ratio is computed once in runtime profile hook
   - passed to `AppThemeProvider`
   - tokens consume the ratio-aware helpers

## Testing

- Test command: `npm run test`
- Starter includes tests for:
  - app route layers (`app/**`)
  - reusable runtime blocks in `src/**`
  - template manifests in `templates/**`

## Lint/format semicolon policy (mobile scope)

- Mobile scope is canonical **no-semi**.
- Local overrides:
  - `mobile/.prettierrc` sets `semi: false`.
  - `mobile/.eslintrc.json` extends parent config and sets:
    - `semi: off`
    - `prettier/prettier` with `{ semi: false }`
- Why: parent workspace `.prettierrc` has `semi: true`, which produced `Insert \`;\`` diagnostics in mobile files through `plugin:prettier/recommended`.
- This local override is intentionally scoped to `examples/new/mobile` to avoid cross-workspace style changes.

## Notes

- Headers use native stack header APIs and shared option factories.
- Interactive components include `testID` support out of the box.
- Dev translate support is configured for missing-key detection in development.
