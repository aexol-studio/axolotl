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

## Backend prerequisites (for starter demo)

Starter demo auth/todo flows use real GraphQL operations from generated Zeus types.

1. Start backend from `examples/new/backend`.
2. Ensure GraphQL endpoint is reachable (default expected by mobile: `http://localhost:4002/graphql`).
3. Ensure Zeus files are generated (user noted they are already built).

## Expo Config

- Project uses typed Expo config in `app.config.ts`.
- GraphQL URL is configured via `extra.graphqlUrl` in `app.config.ts`:

```bash
EXPO_PUBLIC_GRAPHQL_URL=http://localhost:4002/graphql
```

If env var is missing, mobile falls back to `http://localhost:4002/graphql`.

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

## Custom mobile primitives

This starter includes reusable custom primitives (mobile-only):

- custom Reanimated slider (`AppSlider`)
- extended button variants (`PrimaryButton`)
- list strategy + orientation wrappers (`CardList`, `FlashCardList`, `StaticCardList`)
- prop-driven showcase card variants (`ShowcaseCard`)

Detailed API and usage notes are documented in:

- `docs/mobile-primitives.md`

## Feature wave additions (todo + onboarding + spotlight)

- **Persistent onboarding/tour state**: `src/stores/onboardingStore.ts`
  - `hasCompletedOnboarding`
  - `hasCompletedSpotlightTour`
  - complete/reset actions persisted with AsyncStorage
- **Todo flow screen**: `app/(tabs)/todo.tsx` + `src/screens/todo/**`
  - reusable section/composer/filter/item/list components
  - backend-backed operations: load todos, create todo, mark done (`todoOps.markDone`)
  - UI adapts to backend starter capability (no delete mutation in demo flow)
- **Onboarding flow**: `app/onboarding.tsx` + `src/screens/onboarding/OnboardingScreen.tsx`
  - native horizontal paging via `ScrollView pagingEnabled`
  - progress bar from active page index
  - skip/next/finish with persisted completion flag
- **Spotlight/coachmark**: `src/features/spotlight/**`
  - provider + target wrapper + overlay
  - dim + blur mask with highlight rectangle and step actions
  - dim-only fallback is always present (`spotlight-overlay-dim` layer)
- **Auth flow**: `app/(auth)/**` + `src/screens/auth/**` + `src/features/auth/useAuthSession.ts`
  - real login/register mutations
  - auth session token persisted in Zustand store
  - deterministic gate order in root layout: onboarding first, then auth

## Production-like hardening notes (mobile-only wave)

This starter now includes a practical hardening baseline for auth/todos in mobile scope.

### 1) Auth hardening: logout + invalidation fallback

- **Visible logout action** is available in authenticated todo flow (`todo-logout-btn`).
- Logout behavior:
  1. best-effort backend mutation `user.logout`
  2. deterministic local cleanup regardless of network/backend result:
     - clear auth session in store
     - clear React Query cache
     - clear offline todo cache/queue state
     - route back to sign-in
- **No silent refresh loop** is implemented (backend has no refresh endpoint in current contract).
- On auth invalidation signals (e.g. unauth/forbidden/expired token markers), mobile performs explicit session invalidation cleanup and redirects user back to sign-in flow.

### 2) Offline todos fallback + pending sync

- Last successful todos fetch is persisted as offline snapshot.
- If online read fails and snapshot exists, app shows offline fallback data.
- Offline/pending intent queue:
  - supports `createTodo` and `markDone`
  - dedupes repeated queued operations where possible (same content for create, same todoId for markDone)
  - queued items are rendered with pending sync marker in todo list
- Sync behavior:
  - flush queue on reconnect/auth recovery and after successful online mutations
  - bounded retries (`MAX_SYNC_ATTEMPTS=3`)
  - failed operations move to dead-letter list (no infinite retry loops)
  - explicit retry action promotes dead letters back to queue for next sync attempt

### 3) Known backend-contract limitations (non-blocking for starter)

- **No refresh endpoint**: only explicit invalidation + sign-in fallback strategy is possible.
- **`createTodo` contract returns scalar/boolean-style success signal, not rich created entity payload**:
  - offline create reconciliation is best-effort and snapshot/query refresh based
  - robust idempotency/conflict resolution for offline creates is limited in this starter contract

### 4) Storybook showcase updates

- Todo flow stories include an offline/pending state showcase:
  - `Default` -> regular authenticated flow shell
  - `OfflinePendingState` -> seeded cached snapshot + queued operations demo

## Starter demo walkthrough

1. Launch app and complete onboarding.
2. Sign in or register in auth routes.
3. App enters tabs (`Home`, `Todo`).
4. In `Todo` tab:
   - add todo (backend `createTodo`)
   - mark todo done (backend `todoOps.markDone`)
   - filter list (all/active/completed)
5. Start or restart coachmark tour from todo overview card.

- **Storybook real-flow demos**:
  - `src/screens/todo/TodoFlow.stories.tsx`
  - `src/screens/onboarding/OnboardingFlow.stories.tsx`
  - `src/screens/todo/SpotlightFlow.stories.tsx`

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
   - `npm run typecheck`
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
8. Re-run `npm run test`, `npm run typecheck`, and `npm run lint`.

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

## Lint/format policy (mobile scope)

- Mobile uses **ESLint flat config** in `mobile/eslint.config.mjs`.
- Lint scripts are scoped to runtime files only:
  - `npm run lint`
  - `npm run lint:fix`
- Type and test checks:
  - `npm run typecheck`
  - `npm run test`
- Local Prettier policy remains no-semi in `mobile/.prettierrc` (`semi: false`).

## Quality hardening checklist (mobile-only)

Use this checklist for QC/review waves without adding unnecessary product logic.

### 1) Scope safety

- Keep edits in `mobile/**` only.
- Focus on quality posture (guardrails, docs, skills, tests, config consistency).

### 2) Runtime policy checks

- No `as any` in runtime files (`src/**`, `app/**`).
- No external slider/carousel usage in runtime dependencies.
- Interactive elements keep explicit `testID`.
- User-facing copy stays translated (i18n resources/hooks).

### 3) Validation command matrix

Run in `mobile/`:

| Command                         | Purpose                   |
| ------------------------------- | ------------------------- |
| `npm run lint`                  | Lint + runtime guardrails |
| `npm run typecheck`             | Type-safety gate          |
| `npm run test`                  | Regression safety         |
| `npx expo config --type public` | Expo config resolution    |
| `npx expo-doctor`               | Expo ecosystem health     |

### 4) Reporting contract (required)

Every QC report should include:

1. What changed and why.
2. Exact changed files.
3. Docs/skills alignment summary.
4. Validation matrix with PASS/FAIL.
5. Remaining risks/non-blockers.

Additionally, classify violations explicitly:

- **Introduced** by current change (must be fixed in-wave).
- **Baseline** pre-existing (reported separately).

## Notes

- Headers use native stack header APIs and shared option factories.
- Interactive components include `testID` support out of the box.
- Dev translate support is configured for missing-key detection in development.
