# Axolotl Fullstack - LLM Integration Guide

## Overview

This is a fullstack project with an **Axolotl GraphQL backend** and a **React frontend**.

- **Backend**: Axolotl - a type-safe, schema-first GraphQL framework that generates TypeScript types from your schema
- **Frontend**: React + Vite + Tailwind CSS v4 + shadcn/ui + Zeus (type-safe GraphQL client) + Zustand + Sonner (toasts)

---

## Backend (Axolotl)

### Core Concepts

#### Schema-First Development

- Write GraphQL schema in `.graphql` files
- Axolotl CLI generates TypeScript types automatically
- Resolvers are fully typed based on the schema

#### File Structure

```
project/
├── backend/
│   ├── axolotl.json      # Configuration file
│   ├── schema.graphql    # Auto-generated merged schema
│   ├── nodemon.json      # Dev watcher config
│   ├── prisma.config.ts  # Prisma configuration
│   ├── src/
│   │   ├── axolotl.ts    # Framework initialization
│   │   ├── models.ts     # Auto-generated types (DO NOT EDIT)
│   │   ├── resolvers.ts  # mergeAxolotls(auth, users)
│   │   ├── index.ts      # Server entry point
│   │   ├── db.ts         # Shared Prisma client
│   │   ├── context.ts    # AppContext type & AuthUser type
│   │   ├── config/       # App configuration (NOT env vars)
│   │   │   ├── cookies.ts  # Cookie names, options, locales
│   │   │   └── email.ts    # Email verification, delivery mode, Mailgun defaults
│   │   ├── utils/        # Domain-agnostic reusable utilities
│   │   │   ├── auth.ts
│   │   │   ├── cookies.ts
│   │   │   └── validation.ts
│   │   └── modules/
│   │       ├── auth/      # Auth gateway module
│   │       │   ├── schema.graphql
│   │       │   ├── models.ts
│   │       │   ├── axolotl.ts
│   │       │   ├── lib/
│   │       │   │   └── verifyAuth.ts
│   │       │   └── resolvers/
│   │       └── users/     # Users domain module
│   │           ├── schema.graphql
│   │           ├── models.ts
│   │           ├── axolotl.ts
│   │           ├── lib/       # Module-specific helpers
│   │           │   └── ai/    # AI providers (domain-specific)
│   │           └── resolvers/
├── frontend/
│   ├── vite.config.ts    # Vite configuration
│   ├── src/
│   │   └── ...           # React app source
```

> **Note:** The `auth` and `users` modules are **core modules** that provide authentication and user management. The `todos` module is an **example module** included for demonstration — it can be safely removed when building your own application.

#### Backend Folder Placement Rules

- **`src/utils/`** — Domain-agnostic utility functions only (auth primitives, cookie parsing, validation helpers). If it's specific to one module, it doesn't belong here.
- **`src/config/`** — Application configuration that is the SAME for all environments. Feature flags, delivery modes, cookie options, supported locales. These are hardcoded values checked into git — NOT read from `process.env`. Only true secrets (API keys) may come from env vars within config files.
- **`src/context.ts`** — App-level `AppContext` and `AuthUser` types. Not a utility — it's the application contract.
- **`modules/{name}/lib/`** — Module-specific helpers, types, or domain logic (e.g., AI providers, domain validation schemas).
- **NEVER** put domain-specific code in `utils/` or `config/`. Move it to the owning module's `lib/` folder.

### Configuration vs Environment Variables

This project distinguishes between **application config** and **environment variables**:

**Application Config** (`backend/src/config/`):

- Hardcoded values that are the SAME across all environments
- Feature flags: `DISABLE_EMAIL_VERIFICATION`, `EMAIL_MODE`
- Service defaults: Mailgun URL, cookie options, supported locales
- Checked into git — changing these is a code change, not a deployment change
- To adjust for local development convenience, edit the file directly

**Environment Variables** (`.env` files):

- True secrets: `JWT_SECRET`, `MAILGUN_API_KEY`, `OPENAI_API_KEY`, `DATABASE_URL`
- Production overrides: `APP_URL` (real domain), `PORT`
- Testing credentials: `TESTING_USER_EMAIL`, `TESTING_USER_PASSWORD`
- NEVER put feature flags or app behavior toggles in env vars

**Rule:** If a value should be the same in dev, staging, and production — it's config, not an env var. If it varies per environment or is secret — it's an env var.

### Critical Rules

**ALWAYS follow these rules when working with Axolotl:**

1. **NEVER edit models.ts manually** - always regenerate with `axolotl build`
2. **ALWAYS use .js extensions** in imports (ESM requirement)
3. **ALWAYS run axolotl build** after schema changes
4. **CRITICAL: Resolver signature is** `(input, args)` where `input = [source, args, context]` — `source` is rarely used (only in nested type resolvers like `TodoOps`)
5. **CRITICAL: Access context as** `input[2]` or `([, , context])` — this is the primary pattern for all resolvers
6. **Source (`input[0]`) is for nested type resolvers only** (e.g., `TodoOps` receiving a `Todo`). Auth data → `context.authUser`
7. **CRITICAL: Context type must** extend `YogaInitialContext` and spread `...initial`
8. **Import from axolotl.ts** - never from @aexol/axolotl-core directly in resolver files
9. **Use createResolvers()** for ALL resolver definitions
10. **Use mergeAxolotls()** to combine multiple resolver sets
11. **Return empty object `{}`** for nested resolver enablement
12. **Context typing** requires `graphqlYogaWithContextAdapter<T>(contextFunction)`
13. **Auth gateway module** (`src/modules/auth/`) owns the protected resolver gateway pattern (`Query.user`, `Mutation.user`) — these check `context.authUser` and return `{}`. Domain modules should NOT duplicate these gateway resolvers and should access auth data via `context.authUser`, not `source`
14. **NEVER use `as any` in resolvers or backend code** — use named type assertions instead:
    - For Prisma mapper functions: import types from `@/src/prisma/generated/prisma/index.js` and use them directly
    - For Prisma model access: use `prisma.modelName` (camelCase of model name) — `@@map()` only changes the DB table name, NOT the TypeScript accessor
    - For Prisma enum mismatches: import the Prisma enum and cast as `value as SpecificEnum` or use `SpecificEnum.VALUE`
    - For generated input types: trust the fields in `models.ts` — `input.firstName` is typed, `(input as any).firstName` is unnecessary
    - For Express/Yoga bridge in `index.ts`: use `yoga as unknown as express.RequestHandler` (NOT `yoga as any`)
15. **NEVER use `extend type` in module schemas** — Axolotl federation merges types by name, not by SDL extension. Declare `type` (not `extend type`) in each module schema; `axolotl build` combines fields from all modules automatically.
16. **Domain resolvers access auth via `context.authUser`** — never via `source`. The context builder calls `verifyAuth()` and sets `authUser` on every request. Gateway resolvers verify `context.authUser` exists. Domain resolvers use `context.authUser!._id` and `context.authUser!.email`. Source is only used for non-auth parent data (e.g., nested type resolvers).
17. **Resource-level authorization is mandatory** — every resolver that reads or writes a resource MUST verify the authenticated user owns or has permission to access that resource using `context.authUser!._id`. Gateway auth alone is insufficient — it only proves the user is logged in, not that they can access a specific resource.

### Understanding axolotl.json

The `axolotl.json` configuration file is located at `backend/axolotl.json` and defines:

```json
{
  "schema": "schema.graphql",
  "models": "src/models.ts",
  "federation": [
    {
      "schema": "src/modules/auth/schema.graphql",
      "models": "src/modules/auth/models.ts"
    },
    {
      "schema": "src/modules/users/schema.graphql",
      "models": "src/modules/users/models.ts"
    }
  ],
  "zeus": [
    {
      "generationPath": "../frontend/src"
    }
  ]
}
```

**Instructions:**

- Read `backend/axolotl.json` first to understand project structure
- NEVER edit `backend/axolotl.json` unless explicitly asked
- Use paths from config to locate schema and models

> Additional modules (e.g., the included `todos` example) are added to the `federation` array following the same pattern.

### Backend Workflow Checklist

1. **Read `backend/axolotl.json`** to understand structure
2. **Check `backend/schema.graphql`** for current schema
3. **Verify models.ts is up-to-date** (regenerate if needed)
4. **Locate axolotl.ts** to understand initialization
5. **Find resolver files** and understand structure
6. **Make schema changes** if requested
7. **Run `cd backend && axolotl build`** after schema changes
8. **Optionally run `cd backend && axolotl resolvers`** to scaffold new resolver files
9. **Update resolvers** to match new types
10. **Test** that server starts without type errors

### Backend Troubleshooting

#### Type errors in resolvers

**Solution:** Run `cd backend && npx @aexol/axolotl build` to regenerate models

#### Scalar types showing as 'unknown'

**Solution:** Map scalars in axolotl.ts:

```typescript
Axolotl(adapter)<Models<{ MyScalar: string }>, Scalars>();
```

#### Context type not recognized

**Solution:** Use `graphqlYogaWithContextAdapter<YourContextType>(contextFunction)`

#### Context properties undefined

**Solution:** Make sure you spread `...initial` when building context

#### Prisma model accessor not recognized / `prisma.overtimeRecord` type error

**Problem:** TypeScript doesn't know about `prisma.overtimeRecord`, `prisma.surveyResponse`, etc.
**Solution:** These ARE on the typed Prisma client — `prisma.[camelCaseModelName]`. The `@@map()` decorator only renames the database table, not the client property. NEVER use `const db = prisma as any`.

#### TypeScript complains assigning a string to a Prisma enum field

**Problem:** `role: prismaRole` errors — "Type 'string' is not assignable to type 'StaffRole'"
**Solution:** Import the Prisma enum and cast: `import { StaffRole } from '@/src/prisma/generated/prisma/index.js'` then `role: prismaRole as StaffRole`. Or use the enum member directly: `type: CommissionType.VISIT`.

#### Type errors accessing optional fields on generated input types

**Problem:** TypeScript doesn't find `input.firstName` — using `(input as any).firstName` as workaround
**Solution:** The generated interfaces in `models.ts` already have those fields (e.g., `firstName?: string | undefined | null`). Access them directly: `input.firstName ?? null`. No cast needed.

### Backend Quick Reference

| Task                 | Command/Code                                                                 |
| -------------------- | ---------------------------------------------------------------------------- |
| Initialize project   | `npx @aexol/axolotl create-yoga <name>`                                      |
| Generate types       | `cd backend && npx @aexol/axolotl build`                                     |
| Scaffold resolvers   | `cd backend && npx @aexol/axolotl resolvers`                                 |
| Create resolvers     | `createResolvers({ Query: {...} })`                                          |
| Access context       | `([, , context])` - third in tuple                                           |
| Access auth user     | `context.authUser!`                                                          |
| Access source        | `([source])` - nested type resolvers only (e.g., `TodoOps`)                  |
| Merge resolvers      | `mergeAxolotls(resolvers1, resolvers2)`                                      |
| Start server         | `adapter({ resolvers }).server.listen(4000)`                                 |
| Add custom context   | `graphqlYogaWithContextAdapter<Ctx>(contextFn)`                              |
| Context must extend  | `YogaInitialContext & { custom }`                                            |
| Context must include | `{ ...initial, ...custom }`                                                  |
| Define scalars       | `createScalars({ ScalarName: GraphQLScalarType })`                           |
| Define directives    | `createDirectives({ directiveName: mapper })`                                |
| Set auth cookie      | `context.setCookie(token)`                                                   |
| Clear auth cookie    | `context.clearCookie()`                                                      |
| Inspect resolvers    | `npx @aexol/axolotl inspect -s backend/schema.graphql -r ./lib/resolvers.js` |

---

## Frontend (React + Zeus)

### Project Structure

```
frontend/
├── src/
│   ├── api/                     # GraphQL client layer
│   │   ├── client.ts            # Chain client creation
│   │   ├── query.ts             # Query helper
│   │   ├── mutation.ts          # Mutation helper
│   │   ├── subscription.ts      # Subscription helper
│   │   ├── selectors.ts         # Reusable query shape selectors
│   │   ├── errors.ts            # GraphQL error extraction
│   │   └── index.ts             # Re-exports
│   ├── components/              # React components (atomic design)
│   │   ├── atoms/               # Smallest reusable units
│   │   │   ├── CodeSnippet.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── SectionCard.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── index.ts
│   │   ├── molecules/           # Composed atom groups
│   │   │   └── index.ts
│   │   ├── organisms/           # Complex UI sections
│   │   │   └── index.ts
│   │   ├── global/              # App-wide components
│   │   │   ├── ThemeProvider.tsx
│   │   │   ├── TopNav.tsx
│   │   │   └── index.ts
│   │   ├── ui/                  # shadcn/ui primitives (DO NOT EDIT)
│   │   │   ├── Button.tsx, Card.tsx, Dialog.tsx, Form.tsx, ...
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── hooks/                   # Shared data-fetching hooks
│   │   ├── useAuth.ts           # Authentication logic
│   │   ├── useIsMobile.ts       # Responsive breakpoint hook
│   │   └── index.ts
│   ├── lib/                     # Shared utilities
│   │   ├── queryClient.ts       # React Query client config + isAuthenticated()
│   │   ├── queryKeys.ts         # Centralized React Query cache keys
│   │   └── utils.ts             # cn() and general helpers
│   ├── routes/                  # Route pages & layouts
│   │   ├── index.tsx            # Route definitions
│   │   ├── RootLayout.tsx       # Root route layout
│   │   ├── MetaUpdater.tsx      # Client-side document.title updater
│   │   ├── meta.ts              # buildMetaHead() — SSR meta injection
│   │   ├── ErrorPage.tsx        # Error boundary for route loaders
│   │   ├── guest/               # Unauthenticated routes
│   │   │   ├── Layout.tsx
│   │   │   ├── landing/
│   │   │   │   ├── Landing.page.tsx
│   │   │   │   ├── Landing.data.ts
│   │   │   │   └── index.ts
│   │   │   ├── login/
│   │   │   │   ├── Login.page.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── protected/           # Authenticated routes
│   │   │   ├── Layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── Dashboard.page.tsx
│   │   │   │   └── index.ts
│   │   │   ├── settings/
│   │   │   │   ├── Settings.page.tsx
│   │   │   │   ├── Settings.hook.ts
│   │   │   │   ├── components/
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── public/              # Always-accessible routes
│   │   │   └── examples/
│   │   │       ├── Examples.page.tsx
│   │   │       ├── Examples.schema.ts
│   │   │       ├── Examples.data.ts
│   │   │       ├── components/  # Route-scoped components
│   │   │       │   ├── DataDisplaySection.tsx
│   │   │       │   ├── graphql-showcase-tab/
│   │   │       │   ├── forms-showcase-tab/
│   │   │       │   └── index.ts
│   │   │       └── index.ts
│   │   └── not-found/
│   │       ├── NotFound.page.tsx
│   │       └── index.ts
│   ├── zeus/                    # Auto-generated (DO NOT EDIT)
│   │   ├── const.ts
│   │   └── index.ts
│   ├── global.d.ts              # Global type declarations
│   ├── index.css                # Tailwind v4 theme config
│   ├── entry-client.tsx         # Client hydration entry
│   └── entry-server.tsx         # SSR render entry
├── index.html
└── tsconfig.json
```

> **Note:** The `todos` backend module, todo-related hooks, and the `/examples` frontend route are **included for demonstration** and can be safely removed when building your own application.

### UI & Theming

- **shadcn/ui** components live in `src/components/ui/` — import from `@/components/ui`
- **Tailwind CSS v4** — no `tailwind.config` or `postcss.config` files. All theme configuration is in `src/index.css` using `@theme inline` blocks
- **CSS variables** define semantic color tokens (`--background`, `--primary`, `--destructive`, etc.) in `oklch()` color space, with `:root` (light) and `.dark` overrides
- **Dark mode** is class-based (`.dark` on `<html>`), managed by `ThemeProvider` context + `useTheme()` hook
- **`cn()` utility** from `@/lib/utils` — always use for conditional class merging (combines `clsx` + `tailwind-merge`)
- **Icons**: `lucide-react`

### Critical Rules

1. **ALWAYS use Zeus** for GraphQL communication - never write raw GraphQL queries
2. **Use the api/ layer** - import from `../api` not directly from Zeus
3. **Use Zustand stores** for shared client state (UI preferences, non-auth state). Auth state lives in React Query `queryKeys.me` cache — see `useAuth` hook.
4. **ALWAYS use `queryKeys`** from `@/lib/queryKeys.js` for all React Query cache operations — never hardcode strings like `['me']` or `['todos']`. When adding a new query, add its key to `queryKeys` first.
5. **SSR-safe code** - check `typeof window` before accessing browser APIs
6. **Use hooks** for data fetching logic - keep components presentational
7. **ALWAYS define Selectors** for reusable query shapes
8. **ALWAYS use `FromSelector`** to derive TypeScript types from selectors
9. **NEVER manually duplicate backend types** - derive them from selectors
10. **Use `$` function** for GraphQL variables when values come from user input or props
11. **ALWAYS use semantic color tokens** (`bg-primary`, `text-muted-foreground`, `border-border`, etc.) — avoid hardcoded Tailwind colors (`bg-blue-500`, `text-gray-400`) as they won't respond to theme changes
12. **PascalCase for React component files** — `AuthForm.tsx`, `ThemeProvider.tsx`, `UserList.tsx`. **Shared hooks** in `hooks/` keep `useX.ts` naming (e.g., `useAuth.ts`, `useIsMobile.ts`). **Co-located hooks** (extracted from a page/component) use `ComponentName.hook.ts` naming (e.g., `Settings.hook.ts`, `AuthForm.hook.ts`). The exported function is still `useComponentName` per React convention.
13. **Route pages use `.page.tsx` suffix** — each route gets its own folder inside a route group: `routes/guest/landing/Landing.page.tsx`, `routes/protected/dashboard/Dashboard.page.tsx`. Route groups (`guest/`, `protected/`, `public/`) provide shared layouts. Sub-page content without its own route stays as regular `.tsx`
14. **ALWAYS use arrow functions** — `const MyComponent = () => {}` instead of `function MyComponent() {}`. Applies to components, hooks, handlers, helpers — everything. Only exception: generator functions (`function*`)
15. **ALL user-visible strings MUST use `useDynamite().t()`** — never hardcode user-facing text. Import `useDynamite` from `@aexol/dynamite`, destructure `t`, and wrap every label, title, message, placeholder, error message, and button text with `t('English text')`. For files outside the React tree (data files, schemas), use the factory pattern: accept `t` as a parameter. See the `frontend-translations` skill for full patterns.

### Component Architecture

- **Atomic design** for reusable components — organize in `components/atoms/`, `components/molecules/`, `components/organisms/`. Exception: shadcn/ui stays in `components/ui/`
- **File splitting at 400–500 lines** — extract hooks (`ComponentName.hook.ts`), schemas (`.schema.ts`), types (`.types.ts`), data (`.data.ts`), or sub-components. All partitions live next to the component file
- **Reusability-first** — any component with the slightest chance of reuse belongs in the atomic design system with configurable props
- **Route-scoped components** — components used by only one route live in `routes/{route}/components/`. If they grow too large, same splitting rules apply recursively
- **Promote when shared** — if a route-scoped component starts being used by multiple routes, move it to the atomic design system
- **Co-located hooks** — extracted page/component hooks use `.hook.ts` suffix and live next to their component (e.g., `AuthForm.tsx` + `AuthForm.hook.ts`). The function inside is still `useAuthForm` per React convention. These are distinct from shared hooks in `hooks/` which keep the `useX.ts` naming.
- **One hook per file** — co-located hooks should export a SINGLE hook per file (not multiple small hooks). All related data fetching and mutations for a view/component should be consolidated into one hook that returns a flat object with all data and mutation results

### Toast Notifications (Sonner)

This project uses **Sonner** (`sonner`) for toast notifications. Import `toast` directly from sonner:

```typescript
import { toast } from 'sonner';

// Usage
toast.success('Changes saved!');
toast.error('Failed to delete item');
toast.info('Session expired, please log in again');
toast('Default notification');
```

**Rules:**

- Always use `sonner` for toasts - do NOT create custom toast stores or components
- Use semantic methods: `toast.success()`, `toast.error()`, `toast.info()`
- Keep messages short and user-friendly
- The `<Toaster />` component is already mounted in the app root

### Translations (@aexol/dynamite)

This project uses `@aexol/dynamite` for internationalization. **Every user-facing string MUST be translated — hardcoded strings are bugs.**

```typescript
import { useDynamite } from '@aexol/dynamite';

const MyComponent = () => {
  const { t } = useDynamite();
  return <Button>{t('Save changes')}</Button>;
};
```

**Key rules:**

- Use `t('English text')` for ALL labels, titles, buttons, messages, placeholders, error messages, toasts
- Factory pattern for data files/schemas outside React tree: `const getData = (t: (key: string) => string) => ...`
- Don't translate: brand names, code, URLs
- Locale stored in cookie (not localStorage/Zustand)

### SSR Patterns (Data Router)

- Route config in `frontend/src/routes/index.tsx` as `RouteObject[]` — loaders attached per route
- SSR uses per-request `QueryClient` — `entry-server.tsx` creates a fresh instance per request and passes it to loaders via React Router's `requestContext`. No shared singleton on the server.
- On SSR: cookies forwarded via `createSsrChain` → backend validates JWT through normal GraphQL context
- Express SSR handler does NO auth — just locale + translations + render
- Auth state flows through React Query `queryKeys.me` cache only — no Zustand store, no injected globals
- Data fetch in loader: extract `queryClient` from loader context (falls back to singleton on CSR): `const qc = (context as AppLoadContext)?.queryClient ?? queryClient;` then `await qc.fetchQuery(…)`
- Page hydration: `const { dehydratedState } = useLoaderData<typeof loader>()` → `<HydrationBoundary state={dehydratedState}>`
- Meta tags: return `{ meta: { title, description } }` from loader → auto-injected in `<head>` server-side via `buildMetaHead()`

### Frontend Troubleshooting

#### Type errors after schema changes

**Solution:** Regenerate Zeus by running `cd backend && npx @aexol/axolotl build`

#### Zeus files not found

**Solution:** Ensure `backend/axolotl.json` has zeus configuration:

```json
{
  "zeus": [
    {
      "generationPath": "../frontend/src",
      "esModule": true
    }
  ]
}
```

### Frontend Quick Reference

| Task                    | Code                                                                                         |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| Create query            | `query()({ user: { me: { _id: true, email: true } } })`                                      |
| Create mutation         | `mutation()({ login: [{ email, password }, true] })`                                         |
| Access auth (component) | `useAuth().isAuthenticated` or `useAuth().user`                                              |
| Access auth (loader)    | `isAuthenticated(qc)` from `@/lib/queryClient` — pass per-request queryClient in SSR loaders |
| Query keys              | `import { queryKeys } from '@/lib/queryKeys.js'`                                             |
| Show toast (sonner)     | `toast.success('Done!')`                                                                     |
| Mutation with args      | `mutation()({ field: [{ arg: value }, selector] })`                                          |
| Return scalar directly  | `field: [{ args }, true]`                                                                    |

---

### Authentication Architecture

This project uses **JWT+JTI session-based cookie authentication** with a **gateway resolver pattern** for authorization.

**Backend auth flow:**

- Passwords hashed with bcrypt (12 rounds). JWTs signed with HS256 containing `{ userId, email, jti }` where `jti` is a session UUID
- Sessions stored in `Session` table (Prisma) for server-side revocation. 30-day expiry
- Tokens sent via httpOnly `Set-Cookie` header — frontend never touches tokens directly
- Context builder calls `verifyAuth()` on every request (try/catch, non-throwing) → sets `context.authUser`
- Gateway resolvers (`Query.user` / `Mutation.user`) check `context.authUser` exists → throw if not → return `{}`
- Logout: `user { logout }` deletes session from DB + clears cookie via `context.clearCookie()`
- Password change invalidates all other sessions (keeps current one)

**SSR auth flow:**

- Express SSR handler does NO auth — just locale + translations + render
- `entry-server.tsx` creates a per-request QueryClient, detects auth cookie (`COOKIE_NAME` imported from backend config), and seeds `queryKeys.me` before loaders run
- `loaderQuery` auto-selects SSR chain (forwards cookies via `createSsrChain`) or client chain
- On SSR: cookies forwarded → backend validates JWT through normal GraphQL context
- Per-request queryClient is passed to loaders via React Router `requestContext` — child loaders read via `isAuthenticated(qc)`
- No AuthProvider or Zustand store — React Query cache is the single source of truth

**Client auth flow:**

- HydrationBoundary rehydrates React Query cache from SSR — `queryKeys.me` data available immediately
- `useAuth()` hook uses `useQuery({ queryKey: queryKeys.me })` — single source of truth
- `enabled: !!queryClient.getQueryData(queryKeys.me)` remains a guest optimization (guests never auto-refetch `me`)
- Login/register do not rely on invalidation alone: after success they intentionally run `fetchQuery(queryKeys.me)` for deterministic auth sync before treating the user as authenticated
- This explicit `fetchQuery` check confirms the backend-set auth cookie without frontend JWT parsing
- Auth errors (401): React Query global error handler catches → calls logout mutation → clears cache

**Route guards:**

- `protectedLoader`: extracts queryClient from loader context, calls `isAuthenticated(qc)` — redirects to `/login` if not authenticated
- Guest loaders (login, verify-email): same pattern — `isAuthenticated(qc)` to redirect to `/app` if already authenticated
- Page loaders (Dashboard, Settings): data fetching ONLY, zero auth logic

**Auth state:**

- React Query `queryKeys.me` cache holds `UserType | null` — single source of truth
- `useAuth()` hook: `useQuery({ queryKey: queryKeys.me })` + login/register/logout mutations
- In components: `const { user, isAuthenticated } = useAuth()`
- In loaders: `isAuthenticated(qc)` where `qc` is extracted from loader context (`@/lib/queryClient`)

**Key files:**

- `backend/src/context.ts` — `AppContext` with `authUser?: AuthUser`, `setCookie(token)`, `clearCookie()`, `AuthUser` type
- `backend/src/axolotl.ts` — Context builder: extracts cookie/token → calls `verifyAuth` → sets `authUser`
- `backend/src/utils/auth.ts` — JWT sign/verify, bcrypt hash/verify, session token generation
- `backend/src/config/cookies.ts` — `COOKIE_NAME`, `COOKIE_OPTIONS`, locale constants
- `backend/src/config/email.ts` — `DISABLE_EMAIL_VERIFICATION` flag, `EMAIL_MODE`, Mailgun defaults
- `backend/src/utils/cookies.ts` — Cookie serialize/parse utilities
- `backend/src/modules/auth/lib/verifyAuth.ts` — JWT + session verification (used by context builder)
- `backend/src/modules/auth/resolvers/Query/user.ts` — Gateway: checks `context.authUser`, returns `{}`
- `backend/src/modules/auth/resolvers/Mutation/user.ts` — Gateway: checks `context.authUser`, returns `{}`
- `backend/src/modules/users/resolvers/AuthorizedUserMutation/logout.ts` — Logout resolver: deletes session, clears cookie
- `backend/src/index.ts` — SSR server (zero auth, just rendering)
- `frontend/src/lib/queryKeys.ts` — Centralized React Query cache keys (`queryKeys.me`, `.todos`, `.notes`, `.sessions`)
- `frontend/src/lib/queryClient.ts` — QueryClient config, `createQueryClient()` factory, `AppLoadContext` type, global auth error handler, `isAuthenticated(qc?)` helper
- `frontend/src/hooks/useAuth.ts` — Auth hook: `useQuery({ queryKey: queryKeys.me })` + login/register (uses `fetchQuery` for auth detection)/logout
- `frontend/src/routes/index.tsx` — Root loader: translations + dehydration (auth seeded by `entry-server.tsx` before loaders)
- `frontend/src/routes/protected/Layout.tsx` — `protectedLoader`: `isAuthenticated(qc)` guard
- `frontend/src/api/query.ts` — `loaderQuery(request)` auto-selects SSR/client chain
- `frontend/src/api/errors.ts` — `GraphQLErrorEntry` typed interface, `getGraphQLErrorMessage()`, `getGraphQLErrorCode()`, `isAuthError()` — no `as any`

**Adding protected resolvers:** Add field to `AuthorizedUserQuery` or `AuthorizedUserMutation` in your domain module's schema, run `axolotl build`, implement resolver using `context.authUser` (access via `([, , context])` destructuring). Auth is already enforced by the gateway — `context.authUser!` is safe to use with non-null assertion. **Every resolver MUST verify the user owns/has access to the resource** using `context.authUser!._id`.

**⚠️ Resource-Level Authorization (Critical Security):**

Gateway auth only verifies the user is logged in. Every resolver that fetches or mutates a resource MUST additionally verify the user has access:

```typescript
// ✅ Correct — ownership enforced
deleteNote: async ([, , context], { id }) => {
  await prisma.note.findFirstOrThrow({
    where: { id, userId: context.authUser!._id },
  });
  return prisma.note.delete({ where: { id } });
};

// ❌ Wrong — any logged-in user can delete any note
deleteNote: async ([, , context], { id }) => {
  return prisma.note.delete({ where: { id } });
};
```

### E2E Testing (Playwright)

- **Config**: `playwright.config.ts` at project root
- **Test files**: `tests/` directory with `*.spec.ts` files
- **Infrastructure**: `tests/fixtures.ts` (custom fixtures), `tests/page-objects/` (page objects), `tests/helpers/` (utilities)
- **Auth setup**: `tests/auth.setup.ts` — creates authenticated browser state
- **Projects**: `setup` (auth), `chromium` (unauthenticated tests), `chromium-auth` (authenticated tests)
- **Run**: `npm run test:e2e`, `npm run test:e2e:ui` (interactive), `npm run test:e2e:headed` (visible browser)
- **Principle**: Consolidate assertions — ONE test per logical flow, navigate ONCE, assert many things. Avoid granular tests that each reload the page.

## Mobile (examples/new/mobile)

Informacje dotyczące mobile znajdują się w `mobile/AGENTS.md`.
**Before writing any code, always check available skills for detailed guidance on the topic you're working on.**
