---
name: mobile-graphql-react-query-zeus
description: Starter data layer pattern with React Query + Zeus for Expo app
---

# Mobile GraphQL + React Query + Zeus

## Goal
Keep a typed, reusable data layer with clear boundaries.

## Source of truth notes
- Ratio-scaling guidance is defined in `mobile/AGENTS.md`.
- This skill should not duplicate UI scaling policy; reference AGENTS when UI sizing guidance is needed.

## Architecture
1. `src/lib/graphql/config.ts` - API URL resolution
2. `src/lib/graphql/client.ts` - Zeus chain factory
3. `src/lib/graphql/query.ts` - React Query wrapper hook
4. `src/lib/query/createQueryClient.ts` - Query client defaults

## Rules
- Route/screens do not call Zeus directly.
- Use wrapper hooks for all server data access.
- Keep auth token header injection centralized in client factory.
- Generated Zeus artifacts live in `src/zeus/` only.

## Starter Defaults
- Conservative query retry policy
- Explicit staleTime
- No-op Zeus placeholder allowed until generation is connected

## Done Criteria
- Query client provider is mounted at app root.
- A sample screen can call shared query wrapper.
