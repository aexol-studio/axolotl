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
- Keep policy additive and evidence-oriented; reference canonical docs rather than duplicating them.

## QC evidence contract (components scope)

- Show touched component files with file:line evidence for key guardrails.
- Run lint/typecheck/test and report PASS/FAIL explicitly.
- Classify lint/policy findings as baseline vs introduced.

## Component Layers

- `src/components/primitives/` for low-level reusable controls
- `src/components/navigation/` for navigation helpers
- `src/templates/` for reusable screen-level composition

## Requirements

- Named exports only
- Props typed explicitly
- Interactive components must accept and pass `testID`
- Keep design tokens in `src/theme/tokens.ts`

## List Strategy Contract

- Base list abstraction: `src/components/lists/CardList.tsx`.
- `strategy` contract:
  - `'flash'` -> `FlashList` (default; heavier/reactive lists).
  - `'scroll'` -> `ScrollView` (small/static lists).
- Keep strategy choice at component callsite (no route-level list primitives).

## Shadow Guardrail

- Runtime scope (`app/**`, `src/**`) uses `boxShadow` tokens only (via `theme.shadows.*`).
- Do not use legacy shadow props: `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`, `elevation`.
- Guardrail is enforced by `src/__tests__/boundaries/shadow-guardrail.test.ts`.

## Additional runtime guardrails

- Avoid `as any` in runtime component/template code.
- Do not add external slider/carousel libraries; keep starter primitives internal.

## Recommended Starter Blocks

- `AppScreen` scaffold
- `PrimaryButton` with disabled/pressed states
- `EmptyStateTemplate` with CTA
- Native header options helper

## Anti-Patterns

- Hardcoding business copy inside components
- Duplicating spacing/color literals across files
- Coupling components directly to GraphQL calls
