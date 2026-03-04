# Quality Check Pattern Checks (Implementation-Time)

This file is **additive** and does not replace canonical/global policy.

## Intent

Pattern checks must happen **during implementation**, not only as final validation.

## When to apply

Apply these checks whenever changes touch:

- `backend/src/**`
- `frontend/src/**`
- shared lint config/rules

## Implementation-time checklist

1. Before coding, identify relevant quality-check patterns; agent routing may auto-apply `quality-check` guidance, with the skill file as optional reference.
2. While coding, actively avoid:
   - `as any` casts
   - hardcoded user-visible toast strings
   - raw JSX user-facing text not wrapped with `t(...)`
3. After edits, run lint for validation and classify violations:
   - new violations introduced by this change
   - pre-existing baseline violations

## ESLint policy (local)

- Enforce practical anti-pattern checks through local quality-check rules.
- Keep rules high-signal and avoid wide noisy bans.
- Prefer staged strictness:
  - `error`: clear anti-patterns (`as any`, hardcoded toast literals)
  - `warn`: broad heuristics that may require gradual migration (raw JSX text)

## Reporting contract

Each implementation report should include:

- changed files
- quality-check rules wired/enabled
- lint result summary
- explicit baseline-vs-introduced classification for any violations
