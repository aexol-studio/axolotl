---
name: e2e-playwright
description: Playwright E2E execution rules - domain-oriented specs, shared auth setup/storageState, idempotent zero-flake runs, verify-email-disabled support, and canonical Mailgun local email path
---

## Use This Skill For

- Creating/updating Playwright specs, setup, fixtures, or E2E helpers.

## Core Rules (Concise)

1. **Domain-oriented specs**
   - Organize by user flow/domain (`tests/auth/*`, `tests/settings/*`, `tests/notes/*`), not by tiny assertion fragments.
   - Keep one lightweight smoke path; put depth in domain specs.

2. **Hybrid auth strategy (speed + isolation)**
   - **Default (non-destructive authenticated tests):** keep auth bootstrap in `tests/auth.setup.ts` and reuse `storageState` in `chromium-auth`.
   - **Isolated branch (destructive/stateful flows):** create a unique user/session per test in a fresh context using an explicit empty storage state object (`storageState: { cookies: [], origins: [] }`) as primary wording; `storageState: undefined` is also acceptable.
   - Treat password change, session revoke/revoke-all, delete-account, and auth mutation-heavy flows as isolated-only.

3. **Suite cleanup lifecycle is mandatory**
   - Cleanup runs **before and after** the E2E suite via `globalSetup` + `globalTeardown`.

4. **Performance + idempotency + zero-flake**
   - Prefer deterministic readiness checks over fixed sleeps.
   - Write rerunnable tests and setup (safe if user/data already exists).
   - Keep assertions consolidated per flow to reduce repeated navigation.

5. **Verify-email-disabled support is mandatory**
   - Auth setup must support both modes:
     - verification disabled (direct authenticated flow)
     - verification enabled (email verification flow)

6. **Mailgun local mode canonical wording**
   - Use and document the email artifact path as exactly: **`/temp/emails`**.
   - Do not document alternative repo-relative variants as canonical.

7. **Always force local email mode during E2E**
   - E2E runs must force backend `EMAIL_MODE=local` (including CI), even if external env sets `EMAIL_MODE=mailgun`.
   - Verification-enabled auth setup must read links from `/temp/emails`.
   - Use backend env source: `backend/src/config/env.ts`.

8. **Mandatory AI rule for code changes**
   - If code changes, update/add corresponding E2E tests.
   - Run relevant E2E checks; run the full E2E suite when behavior changes.

## Quick Agent Checklist

- [ ] Specs grouped by domain flow
- [ ] Non-destructive auth specs use shared setup + `storageState`
- [ ] Destructive/stateful auth flows use isolated per-test users/sessions with explicit empty `storageState` object
- [ ] Suite cleanup runs before + after via `globalSetup` + `globalTeardown`
- [ ] No fixed waits; setup/specs are idempotent
- [ ] Verification ON/OFF behavior covered
- [ ] E2E runtime forces `EMAIL_MODE=local` (incl. CI)
- [ ] Local email docs/helpers use canonical `/temp/emails`
- [ ] Code changes include matching E2E updates and required E2E validation
