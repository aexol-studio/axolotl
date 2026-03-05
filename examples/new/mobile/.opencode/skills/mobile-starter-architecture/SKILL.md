---
name: mobile-starter-architecture
description: Baseline architecture for Axolotl mobile starter (Expo Router + reusable blocks)
---

# Mobile Starter Architecture

## Goal

Create starter-level, reusable mobile foundations in `examples/new/mobile`.
Do not implement full product logic here.

## Source of truth notes

- Ratio-scaling guidance lives in `mobile/AGENTS.md`.
- Do not duplicate full ratio policy in this skill; follow the AGENTS summary and apply it where needed.
- Keep guidance additive: reference canonical/OpenCode policy docs instead of restating them here.

## QC reporting contract (for this skill)

- Evidence-driven output only: list touched files and file:line proof for key decisions.
- Include validation results as command -> PASS/FAIL.
- Classify violations as **baseline** vs **introduced** in every report.

## Stack Contract

- Expo SDK 54 + TypeScript
- Expo Router as navigation entry
- React Query for server state
- Zustand for app-local state
- Zeus-generated client for GraphQL contract
- i18next/react-i18next for translations

## Required Structure

- `app/` for route files and route groups
- `src/components/` for reusable native primitives
- `src/templates/` for reusable screen templates
- `src/features/` for feature hooks/modules
- `src/lib/graphql/` for Zeus + query wrappers
- `src/lib/i18n/` for i18n bootstrap and resources
- `src/providers/` for app providers
- `src/stores/` for Zustand stores
- `src/theme/` for tokens and style helpers
- `src/zeus/` placeholder until generation is wired

## Rules

1. Build composable blocks, not final business flows.
2. Keep route files thin; put logic in hooks/services.
3. Add `testID` on all interactive elements.
4. Keep public text in i18n keys only.
5. Keep generated Zeus files isolated from hand-written code.
6. Keep quality hardening changes architecture-focused (guardrails/docs/tests), not product feature expansion.

## Integral Starter Boundaries

- **Provider chain baseline**: `SafeArea -> RuntimeInit -> Keyboard -> Theme -> Suspense -> (optional integrations) -> Query -> Toast` (see `src/providers/AppProviders.tsx`).
- **Runtime init**: app boot uses `runRuntimeInit()` (`initThemeBase()` + `initI18n()`), fail-safe (must not block first render).
- **Template boundary**: `templates/**` are opt-in blueprints; runtime only from `app/**` + `src/**`.
- **testID contract**: all interactive runtime primitives/components must expose and pass `testID`.
- **State-view pattern**: use `useStateView` with `LoadingState/ErrorState/EmptyState` for loading/error/empty/success rendering.

## Done Criteria

- App boots with providers and route groups.
- At least one starter tab and one auth screen exist.
- Reusable primitives/templates are present and wired.
