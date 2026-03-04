---
name: mobile-i18n-dev-translate
description: i18n baseline and dev-translate setup for Expo mobile starter
---

# Mobile i18n + Dev Translate

## Goal
Ensure all user-facing strings are translatable from day one.

## Source of truth notes
- Ratio-scaling guidance remains in `mobile/AGENTS.md`.
- Keep this skill scoped to i18n/dev-translate; do not duplicate scaling policy here.

## Baseline Setup
- Use `i18next` + `react-i18next`
- Keep resources under `src/lib/i18n/resources/{lang}/`
- Initialize in app providers at startup

## Language Management
- Store app language in Zustand store
- Expose explicit language switch function
- Use fallback language (`en`)

## Dev Translate
- Enable missing-key diagnostics in development
- Log missing keys with namespace and language
- Keep feature text in keys, never inline literals

## Starter Done Criteria
- At least `en` and `pl` resources exist
- Home and auth starter screens read strings from i18n
- Missing-key logs are enabled for development mode
