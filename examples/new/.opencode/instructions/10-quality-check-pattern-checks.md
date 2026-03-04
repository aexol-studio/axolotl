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

1. While coding, actively avoid:
   - `as any` casts
   - hardcoded user-visible toast strings
   - raw JSX user-facing text not wrapped with `t(...)`
2. After edits, run lint for validation and classify violations:
   - new violations introduced by this change
   - pre-existing baseline violations

## ESLint policy (local)

- Keep rules high-signal and avoid wide noisy bans.
- Prefer staged strictness:
  - `error`: clear anti-patterns (`as any`, hardcoded toast literals)
  - `warn`: broad heuristics that may require gradual migration (raw JSX text)

## Reporting contract

Each implementation report should include:

- changed files
- lint result summary
- explicit baseline-vs-introduced classification for any violations
