---
name: quality-check
description: Preemptive quality checks during implementation (casts, translations, anti-patterns) with ESLint-backed guardrails
---

# Quality Check (Preemptive)

Use this skill **before and during implementation**, not only as a post-task audit.

## Goal

Catch recurring quality regressions early:

- unsafe casts (especially `as any`)
- missing translation wrappers for UI strings
- selected anti-patterns (hardcoded toast strings, raw JSX user text)

## Required flow

1. **Plan quality constraints first**
   - Identify touched files and likely risk areas (forms, toasts, JSX-heavy screens, resolver typing).
   - Declare which quality checks apply before writing edits.

2. **Implement with guardrails active**
   - Prefer typed narrowing and named types over casting.
   - Wrap user-facing strings with `t(...)` in React tree.
   - Avoid direct literal strings in `toast.*(...)` calls.

3. **Run focused lint on changed scope**
   - Validate wiring and rule behavior in files you changed.
   - If existing baseline violations appear, classify them as:
     - `introduced by this change` (must fix now)
     - `pre-existing baseline` (report with file list + severity)

4. **Report outcome explicitly**
   - Which rules ran
   - Which files passed/failed
   - Whether failures are new or baseline

## Practical rule policy

- Keep rules high-signal (avoid broad brittle heuristics).
- Prefer `error` for clearly unsafe patterns (`as any`, hardcoded toast literals).
- Use `warn` for heuristics that may need gradual cleanup (raw JSX text).

## Quick examples

- ✅ Good: `const value = response as UserPayload;`
- ❌ Bad: `const value = response as any;`

- ✅ Good: `toast.error(t('Failed to save profile'))`
- ❌ Bad: `toast.error('Failed to save profile')`

- ✅ Good: `<Button>{t('Save')}</Button>`
- ⚠️ Warn: `<Button>Save</Button>`
