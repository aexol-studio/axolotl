# vite-ssr — SSR Data Router Skill

Vite + React Router v7 Data Router + `renderToPipeableStream` + TanStack Query `HydrationBoundary`.

## Architecture

```
browser request
  └─▶ backend/src/index.ts (Express)
        ├─ verifies auth cookie → sets x-authenticated / x-locale headers
        ├─ calls render(webRequest, { isAuthenticated, locale })
        └─▶ frontend/src/entry-server.tsx
              ├─ createStaticHandler(routeConfig) → handler.query(request)  [runs all loaders]
              ├─ createStaticRouter(handler.dataRoutes, context)
              ├─ renderToPipeableStream(<StaticRouterProvider …/>)
              └─ buildMetaHead(context.matches) → <title> + <meta> tags

hydration
  └─▶ frontend/src/entry-client.tsx
        ├─ createBrowserRouter(routeConfig)  // local const — NOT exported from routes
        ├─ reads window.__INITIAL_AUTH__
        └─ hydrateRoot(…<RouterProvider router={browserRouter} />…)
```

**Critical facts:**

- `routes/index.tsx` exports only `routeConfig: RouteObject[]` — no router instance ever
- `createBrowserRouter` is in `entry-client.tsx` only — never in `routes/index.tsx`
- `hydrateRoot` not `createRoot`; `renderToPipeableStream` not `renderToString`
- `<StaticRouterProvider … />` — **NO `hydrate={false}`**
- `queryClient.clear()` at top of `render()` — per-request isolation

## Loader Pattern

Loaders live in `{RouteName}.data.ts` next to the page file. See `frontend-navigation` skill for the auth guard pattern.

```tsx
// loader return shape
return {
  dehydratedState: dehydrate(queryClient),
  meta: { title: 'Page Title', description: '…', 'og:title': '…', 'og:description': '…' },
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

| Placeholder                | Replaced with                                                                                   |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| `<!--app-head-->`          | `<title>` + `<meta>` from `buildMetaHead()` (`rendered.head`)                                   |
| `<!--app-initial-state-->` | `<script>window.__INITIAL_AUTH__=…; __INITIAL_TRANSLATIONS__=…; __INITIAL_LOCALE__=…;</script>` |
| `<!--app-html-->`          | Server-rendered HTML from `renderToPipeableStream`                                              |

`lang="en"` on `<html>` is replaced with `lang="${rendered.locale}"`.

## Quick Reference

| Task                          | Pattern                                                                                        |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| Auth check in loader (SSR)    | `request.headers.get('x-authenticated') === 'true'`                                            |
| Auth check in loader (client) | `typeof window !== 'undefined' && useAuthStore.getState().isAuthenticated`                     |
| Fetch data in loader          | `await queryClient.fetchQuery(…)` — throws on error → `errorElement`                           |
| Public route fetch            | wrap `fetchQuery` in `try/catch` — never throw                                                 |
| Hydrate page component        | `const { dehydratedState } = useLoaderData<typeof loader>()` + `<HydrationBoundary state={…}>` |
| SSR redirect                  | `throw redirect('/login')`                                                                     |
| Provide meta                  | `return { meta: { title, description, 'og:title', 'og:description' }, dehydratedState }`       |
| Client title update           | automatic via `<MetaUpdater />` in `RootLayout` — do not add manually                          |
| Error boundary                | `errorElement: <ErrorPage />` on every route with a loader                                     |
| `StaticRouterProvider`        | **NO** `hydrate={false}`; use `renderToPipeableStream` not `renderToString`                    |
