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

## Route Conventions
- Use route groups for app domains:
  - `app/(tabs)/...`
  - `app/(auth)/...`
- Keep root composition in `app/_layout.tsx`.
- Put shared header option factories in `src/components/navigation/`.

## Header Rules
- Use native stack options factory (for consistent look).
- Disable back title globally unless explicitly needed.
- Keep titles in i18n for user-facing screens.

## Route File Pattern
- Route file should compose screen and hook/template.
- Avoid inline API and heavy business logic in route files.

## Starter Checklist
- Root layout with providers and stack
- Tabs layout with at least one tab
- Auth stack layout with at least one screen
