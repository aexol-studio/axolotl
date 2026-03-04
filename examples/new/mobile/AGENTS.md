# Mobile Starter Agent Guide (examples/new/mobile)

This file is the **local source of truth for mobile-starter guidance** in `examples/new/mobile`.

Use it together with repository/global AGENTS rules. Keep local guidance additive (do not duplicate or override canonical policy).

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
- Clamp: `scale = clamp(ratio, 0.85, 1.2)`

Practical rules:

- Prefer one shared scaling helper over per-screen magic multipliers.
- Keep touch targets accessible (minimum interactive height ~44).
- Scale spacing/dimensions consistently; keep typography stable unless scope explicitly requires text scaling.
- If a screen needs an exception, document the reason near that screen.
