---
name: mobile-routing-expo-router
description: Expo Router conventions for route groups, native headers, and starter navigation
---

# Mobile Routing (Expo Router)

## Goal

Keep navigation predictable, native, and reusable.

## Source of truth notes

- Ratio-scaling guidance is maintained in `mobile/AGENTS.md`.
- If route-level UI needs scaling decisions, reference that file instead of introducing duplicated policy here.
- Keep this skill additive and concise; do not copy canonical global policy text.

## QC evidence contract (routing scope)

- For routing changes, report exact route files touched and why.
- Confirm interactive header/CTA elements preserve `testID` where applicable.
- Include baseline-vs-introduced violation classification in results.

## Route Conventions

- Use route groups for app domains:
  - `app/(tabs)/...`
  - `app/(auth)/...`
- Keep root composition in `app/_layout.tsx`.
- Put shared header option factories in `src/components/navigation/`.

## Header Rules

- Use native stack options factory (`createNativeHeaderOptions`) for consistent options.
- Baseline options from factory: `headerShadowVisible: false`, `headerBackTitleVisible: false`.
- Keep root group headers hidden in `app/_layout.tsx` for `(tabs)` and `(auth)` entries.
- Set route titles explicitly per screen/group (no implicit defaults).
- Keep titles aligned with current code baseline (e.g. tabs index `Axolotl`, auth sign-in `Sign in`) unless scope explicitly includes i18n/title refactor.

## Route File Pattern

- Route file should compose screen and hook/template.
- Avoid inline API and heavy business logic in route files.

## Starter Checklist

- Root layout with providers and stack
- Tabs layout with at least one tab
- Auth stack layout with at least one screen
