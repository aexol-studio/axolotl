---
name: mobile-components
description: Reusable native component and template patterns for starter implementation
---

# Mobile Components

## Goal
Build reusable native UI building blocks before feature-specific UIs.

## Source of truth notes
- Ratio-scaling guidance for component sizing lives in `mobile/AGENTS.md`.
- Keep this skill focused on component patterns; avoid re-stating full scaling policy.

## Component Layers
- `src/components/primitives/` for low-level reusable controls
- `src/components/navigation/` for navigation helpers
- `src/templates/` for reusable screen-level composition

## Requirements
- Named exports only
- Props typed explicitly
- Interactive components must accept and pass `testID`
- Keep design tokens in `src/theme/tokens.ts`

## Recommended Starter Blocks
- `AppScreen` scaffold
- `PrimaryButton` with disabled/pressed states
- `EmptyStateTemplate` with CTA
- Native header options helper

## Anti-Patterns
- Hardcoding business copy inside components
- Duplicating spacing/color literals across files
- Coupling components directly to GraphQL calls
