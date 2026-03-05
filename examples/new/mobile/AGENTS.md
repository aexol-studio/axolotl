# Mobile Starter Agent Guide (examples/new/mobile)

This file is the **local source of truth for mobile-starter guidance** in `examples/new/mobile`.

Use it together with repository/global AGENTS rules. Keep local guidance additive (do not duplicate or override canonical policy).

## Mobile quality hardening addendum (additive)

Use this addendum when the task asks for review/QC/hardening in mobile scope.

### Scope gate

- Allowed runtime scope: `mobile/src/**`, `mobile/app/**`, mobile docs/skills/config.
- Do not change backend or frontend-web from this guide.

### Evidence-first QC contract

For each hardening pass, include:

1. Changed files + reason.
2. Validation matrix (command -> PASS/FAIL).
3. Policy scans summary.
4. Baseline-vs-introduced classification for violations.

### Baseline-vs-introduced classification

- **Introduced** = violation appears only because of this change and must be fixed in-wave.
- **Baseline** = pre-existing violation outside touched scope; report clearly, do not relabel as fixed.

### Runtime guardrails checklist

- No `as any` in runtime sources (`src/**`, `app/**`).
- No external slider/carousel packages in runtime implementation.
- All interactive elements expose `testID`.
- All user-facing strings use i18n resources/hooks (no hardcoded copy).

### Required validation set (mobile dir)

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npx expo config --type public`
- `npx expo-doctor`

## AGENTS-first workflow (mobile)

Before implementation in `examples/new/mobile`:

1. Read this file first (mobile-local constraints).
2. Agent routing may auto-apply relevant mobile guidance; use this file as the primary local reference and repository/global AGENTS rules when needed.
3. Keep implementation starter-oriented (reusable blocks/providers/templates), not full product logic.

## Ratio scaling guidance (mobile source)

Use ratio-based scaling only when dynamic sizing is actually needed.

- Runtime viewport source: `useWindowDimensions()`
- Base viewport: `390 x 844`
- Ratios: `ratioW = width / 390`, `ratioH = height / 844`
- Uniform scale: `ratio = Math.min(ratioW, ratioH)`
- Clamp: `scale = clamp(ratio, 0.9, 1.2)`

Practical rules:

- Prefer one shared scaling helper over per-screen magic multipliers.
- Keep touch targets accessible (minimum interactive height ~44).
- Scale spacing/dimensions consistently; keep typography stable unless scope explicitly requires text scaling.
- If a screen needs an exception, document the reason near that screen.
