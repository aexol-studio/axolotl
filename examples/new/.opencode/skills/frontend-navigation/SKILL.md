---
name: frontend-navigation
description: React Router v7 navigation - route definitions, SSR integration, auth guards, Link/Navigate patterns, layout nesting, and project conventions
---

## Architecture

React Router v7 **Data Router** — `RouteObject[]` config, not JSX `<Routes>/<Route>`.

- `routeConfig: RouteObject[]` in `frontend/src/routes/index.tsx` — single source of truth
- `createBrowserRouter(routeConfig)` in `entry-client.tsx` — local const, never exported from routes
- `createStaticHandler` / `createStaticRouter` in `entry-server.tsx` for SSR
- All imports from `'react-router'` — no `react-router-dom`
- Auth guards in **loaders** — layout components are pure `<Outlet />` wrappers

## Route Config

`frontend/src/routes/index.tsx` exports `routeConfig: RouteObject[]` — a flat config array, never JSX `<Routes>`.

Structure:

- Root route (`id: 'root'`) with `<RootLayout />` and `rootLoader`
- `<GuestLayout />` group → guest routes (`/`, `/login`)
- `<ProtectedLayout />` group → protected routes (`/app`, `/settings`)
- Public routes at root level (`/examples`)
- `{ path: '*', element: <NotFound /> }` catch-all

To add a route: add a `RouteObject` to the correct group's `children[]` in `routes/index.tsx`.

| Path        | Component   | Auth                    | Group             |
| ----------- | ----------- | ----------------------- | ----------------- |
| `/`         | `Landing`   | No (→ `/app` if authed) | `GuestLayout`     |
| `/login`    | `Login`     | No (→ `/app` if authed) | `GuestLayout`     |
| `/examples` | `Examples`  | No                      | Public (no wrap)  |
| `/app`      | `Dashboard` | Yes (→ `/login`)        | `ProtectedLayout` |
| `/settings` | `Settings`  | Yes (→ `/login`)        | `ProtectedLayout` |
| `*`         | `NotFound`  | No                      | Root              |

## Auth Guards — Loaders Only

```tsx
// isomorphic auth check (use in every loader that needs auth)
const isAuthenticated =
  request.headers.get('x-authenticated') === 'true' || // SSR
  (typeof window !== 'undefined' && useAuthStore.getState().isAuthenticated); // client

// protected loader → throw redirect
if (!isAuthenticated) throw redirect('/login');

// guest loader → return redirect
if (isAuthenticated) return redirect('/app');
```

## Navigation

```tsx
import { Link, Navigate, useNavigate } from 'react-router';
<Link to="/app">Dashboard</Link>
<Navigate to="/app" replace />  {/* replace on auth redirects — prevents back-button loops */}
const navigate = useNavigate();
navigate('/app'); navigate('/', { replace: true });
```

## File Structure

```
frontend/src/routes/
├── index.tsx          # routeConfig + rootLoader
├── RootLayout.tsx     # ThemeProvider > DynamiteProvider > QueryClientProvider > Outlet
├── ErrorPage.tsx      # useRouteError() fallback — used as errorElement
├── MetaUpdater.tsx    # document.title updater via useMatches (mounted in RootLayout)
├── meta.ts            # RouteMeta interface + buildMetaHead() for SSR head injection
├── guest/Layout.tsx   # GuestLayout — pure <Outlet />
├── guest/landing/     # path: '/'
├── guest/login/       # path: '/login'
├── protected/Layout.tsx  # ProtectedLayout — pure <Outlet />
├── protected/dashboard/  # path: '/app'
├── protected/settings/   # path: '/settings'
├── public/examples/   # path: '/examples'
└── not-found/         # path: '*'
```

## Conventions

- `RouteObject[]` config only — never JSX `<Routes>/<Route>`
- Auth in loaders — layouts are pure `<Outlet />`
- Protected: `throw redirect('/login')` — Guest: `return redirect('/app')`
- `.js` extensions in imports — ESM requirement (`from './Layout.js'`)
- Arrow functions everywhere: `const X = () => {}`
- Route-scoped components → `routes/{group}/{route}/components/`

## Quick Reference

| Task                     | Code/Pattern                                                           |
| ------------------------ | ---------------------------------------------------------------------- |
| Import router primitives | `import { Link, useNavigate, useLoaderData } from 'react-router'`      |
| Navigate with link       | `<Link to="/app">Dashboard</Link>`                                     |
| Redirect component       | `<Navigate to="/" replace />`                                          |
| Programmatic navigation  | `const navigate = useNavigate(); navigate('/app')`                     |
| Auth guard (protected)   | `if (!isAuthenticated) throw redirect('/login')` in loader             |
| Auth guard (guest)       | `if (authed) return redirect('/app')` in loader                        |
| Add route                | Add `RouteObject` to correct layout's `children` in `routes/index.tsx` |
