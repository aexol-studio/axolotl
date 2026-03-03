# vite-ssr — SSR Data Router Skill

Vite + React Router v7 Data Router + `renderToPipeableStream` + TanStack Query `HydrationBoundary`.

## Architecture

```
browser request
  └─▶ backend/src/index.ts (Express)
        ├─ NO auth — just locale + translations + render
        ├─ calls render(webRequest, { locale })
        └─▶ frontend/src/entry-server.tsx
              ├─ createQueryClient() — fresh per-request instance (no shared singleton)
              ├─ seeds queryKeys.me from auth cookie before loaders run (guards can read auth state)
              ├─ handler.query(request, { requestContext: { queryClient } })  [loaders get per-request client]
              ├─ loaderQuery auto-selects SSR chain (forwards cookies) or client chain
              ├─ createStaticRouter(handler.dataRoutes, context)
              ├─ renderToPipeableStream(<StaticRouterProvider …/>)
              └─ buildMetaHead(context.matches) → <title> + <meta> tags
```

**Critical facts:**

- `routes/index.tsx` exports only `routeConfig: RouteObject[]` — no router instance ever
- `createBrowserRouter` is in `entry-client.tsx` only — never in `routes/index.tsx`
- `hydrateRoot` not `createRoot`; `renderToPipeableStream` not `renderToString`
- `<StaticRouterProvider … />` — **NO `hydrate={false}`**
- Fresh `QueryClient` created per request — true per-request isolation (no `clear()` on shared singleton)

## Loader Pattern

Loaders are route-scoped and commonly exported from `{RouteName}.page.tsx`. Split to `{RouteName}.data.ts` only when the loader grows or needs reuse. See `frontend-navigation` for auth guard patterns.

```tsx
// In loader — extract per-request queryClient (falls back to CSR singleton)
const qc = (context as AppLoadContext | undefined)?.queryClient ?? queryClient;
return {
  dehydratedState: dehydrate(qc),
  meta: { title: 'Page Title', description: '…' },
};
// fetchQuery throws on error → errorElement; wrap in try/catch for public routes
```

## Page Component Pattern

```tsx
export const Dashboard = () => {
  const { dehydratedState } = useLoaderData<typeof dashboardLoader>();
  return (
    <HydrationBoundary state={dehydratedState}>
      {' '}
      {/* must be inside QueryClientProvider (RootLayout) */}
      <DashboardContent /> {/* useQuery() hooks pick up pre-fetched SSR data */}
    </HydrationBoundary>
  );
};
```

## Two-Layer Meta System

**Layer 1 — SSR** (`routes/meta.ts`): `buildMetaHead(matches)` walks loader data with `reduceRight` (deepest route wins), emits `<title>` + `<meta>` injected into `<!--app-head-->`.

**Layer 2 — Client SPA** (`routes/MetaUpdater.tsx`): mounted in `RootLayout`, `useMatches()` + `useEffect` updates `document.title` on navigation. Only title — `<meta>` tags not updated client-side (crawlers get fresh SSR).

Return from any loader: `{ dehydratedState, meta: { title, description, 'og:title', 'og:description' } }`

## `index.html` Placeholders

| Placeholder                | Replaced with                                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------- |
| `<!--app-head-->`          | `<title>` + `<meta>` from `buildMetaHead()` (`rendered.head`)                                            |
| `<!--app-initial-state-->` | `<script>__INITIAL_TRANSLATIONS__=…; __INITIAL_LOCALE__=…;</script>` (auth via queryClient, not globals) |
| `<!--app-html-->`          | Server-rendered HTML from `renderToPipeableStream`                                                       |

`lang="en"` on `<html>` is replaced with `lang="${rendered.locale}"`.

## Quick Reference

| Task                   | Pattern                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| Auth check in loader   | `isAuthenticated(qc)` where `qc` is from loader context (`@/lib/queryClient`)                  |
| Fetch data in loader   | `await qc.fetchQuery(…)` where `qc` is extracted from loader context                           |
| Public route fetch     | wrap `fetchQuery` in `try/catch` — never throw                                                 |
| Hydrate page component | `const { dehydratedState } = useLoaderData<typeof loader>()` + `<HydrationBoundary state={…}>` |
| SSR redirect           | `throw redirect('/login')`                                                                     |
| Provide meta           | `return { meta: { title, description, 'og:title', 'og:description' }, dehydratedState }`       |
| Client title update    | automatic via `<MetaUpdater />` in `RootLayout` — do not add manually                          |
| Error boundary         | `errorElement: <ErrorPage />` on every route with a loader                                     |
| `StaticRouterProvider` | **NO** `hydrate={false}`; use `renderToPipeableStream` not `renderToString`                    |

## Auth Cache Sync + Guest Optimization

- Keep guest optimization for `me` query with `enabled: !!queryClient.getQueryData(queryKeys.me)` (guests should not auto-refetch `me`).
- Auth mutation exception (`login`/`register`): after success, explicitly run `await queryClient.fetchQuery({ queryKey: queryKeys.me, queryFn: ... })` to sync auth state deterministically; do not rely on invalidation alone.
- Auth ownership: React Query `queryKeys.me` cache is the single source of truth; do not mirror auth in Zustand.
