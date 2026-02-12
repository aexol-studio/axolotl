---
name: frontend-navigation
description: React Router v7 navigation - route definitions, SSR integration, auth guards, Link/Navigate patterns, layout nesting, and project conventions
---

## Navigation Architecture

React Router v7 (`^7.12.0`) provides all routing capabilities through a single `react-router` package. This project uses the classic `<Routes>`/`<Route>` JSX pattern (NOT the data router pattern) with SSR via Vite, splitting between `BrowserRouter` (client) and `StaticRouter` (server).

**Key Points:**

- All imports come from `'react-router'` — no `react-router-dom` needed
- Classic JSX route definitions with `<Routes>` and `<Route>`
- SSR-safe architecture: server renders unauthenticated state, client hydrates auth from localStorage

---

## Route Definitions

**File: `frontend/src/routes/index.tsx`**

```tsx
import { Routes, Route } from 'react-router';
import { GuestLayout } from './guest';
import { ProtectedLayout } from './protected';
import { Landing } from './guest/landing';
import { Dashboard } from './protected/dashboard';
import { Examples } from './public/examples';
import { AdminLayout } from './protected/admin';
import { AdminDashboard } from './protected/admin/dashboard';
import { AdminUsers } from './protected/admin/users';
import { AdminSettings } from './protected/admin/settings';

export const AppRoutes = () => (
  <Routes>
    <Route element={<GuestLayout />}>
      {/* redirect to /app if already authenticated */}
      <Route path="/" element={<Landing />} />
    </Route>
    <Route path="/examples" element={<Examples />} />
    {/* public — no auth check */}
    <Route element={<ProtectedLayout />}>
      {/* redirect to / if not authenticated */}
      <Route path="/app" element={<Dashboard />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Route>
  </Routes>
);
```

### Route Map

| Path              | Component        | Auth Required                        | Layout        | Purpose            |
| ----------------- | ---------------- | ------------------------------------ | ------------- | ------------------ |
| `/`               | `Landing`        | No (redirects to `/app` if authed)   | `GuestLayout` | Login/Register     |
| `/examples`       | `Examples`       | No                                   | None          | Public examples    |
| `/app`            | `Dashboard`      | Yes (redirects to `/` if not authed) | None          | Main app dashboard |
| `/admin`          | `AdminDashboard` | Yes (via ProtectedLayout)            | `AdminLayout` | Admin overview     |
| `/admin/users`    | `AdminUsers`     | Yes (via ProtectedLayout)            | `AdminLayout` | User management    |
| `/admin/settings` | `AdminSettings`  | Yes (via ProtectedLayout)            | `AdminLayout` | App settings       |

---

## Route Grouping Convention

Routes are organized into three access-level group folders:

| Group      | Folder              | Auth Behavior                        |
| ---------- | ------------------- | ------------------------------------ |
| Guest-only | `routes/guest/`     | Redirect to `/app` if authenticated  |
| Public     | `routes/public/`    | No auth check — visible to all       |
| Protected  | `routes/protected/` | Redirect to `/` if not authenticated |

**Rules:**

- `routes/index.tsx` is the **single source of truth** for all route definitions and protection logic
- Group folders are a co-location convenience — they do NOT enforce protection (that's done by layout guards in `index.tsx`)
- Each group's auth guard layout lives at the group root: `guest/Layout.tsx`, `protected/Layout.tsx`
- Group root barrels export only the layout: `export { GuestLayout } from './Layout'`
- Sub-groups (e.g., `protected/admin/`) can have their own `Layout.tsx` for nested layouts

---

## SSR Integration

SSR uses two entry points with different routers. Imports: `BrowserRouter`/`StaticRouter` from `'react-router'`, `hydrateRoot`/`renderToString` from `'react-dom'`.

```tsx
// entry-client.tsx — BrowserRouter wraps <App /> in hydrateRoot()
hydrateRoot(
  root,
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);

// entry-server.tsx — StaticRouter receives URL from Express
export const render = (url: string) => ({
  html: renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  ),
});
```

- SSR renders unauthenticated state (no `localStorage` on server); client hydration rehydrates auth and may redirect. Express passes `req.originalUrl` to `render(url)`.

---

## Navigation Patterns

### Declarative Navigation with `<Link>`

```tsx
// ✅ CORRECT - use Link for in-app navigation
import { Link } from 'react-router';
<Link to="/admin/users">Users</Link>

// ❌ WRONG - never use <a> tags for internal routes (breaks SPA)
<a href="/admin/users">Users</a>
```

### Declarative Redirects with `<Navigate>`

```tsx
import { Navigate } from 'react-router';

if (!isAuthenticated) return <Navigate to="/" replace />; // ← replace prevents back-button loops
if (isAuthenticated) return <Navigate to="/app" replace />;
```

### Active Link Detection with `useLocation()`

```tsx
import { Link, useLocation } from 'react-router';
const location = useLocation();
const isActive = location.pathname === item.path; // exact match — no startsWith() needed

<Link to={item.path} className={isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}>
  {item.label}
</Link>;
```

### Project Convention: No Imperative Navigation

```tsx
// ✅ All navigation is declarative: <Link> and <Navigate>
// ❌ WRONG - useNavigate() is NOT used in this project
const navigate = useNavigate();
navigate('/admin/users'); // Don't do this
```

---

## Auth Guards (Route Protection)

Route protection uses **layout-based guards** — dedicated layout components that wrap groups of routes. **Never use inline auth guards** inside individual page components.

### ProtectedLayout (authenticated routes)

```tsx
// routes/protected/Layout.tsx
import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export const ProtectedLayout = () => {
  const { isLoading, isAuthenticated } = useAuth();
  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet />;
};
```

### GuestLayout (unauthenticated routes)

Same pattern as `ProtectedLayout` but with inverted logic — redirects **authenticated** users away:

```tsx
// routes/guest/Layout.tsx — key difference:
if (isAuthenticated) return <Navigate to="/app" replace />;
```

**Key Points:**

- **Never put auth guards inside page components** — protection is structural, at the route level
- Auth check happens once in the layout — all nested routes are automatically protected
- `isLoading` check prevents flash-redirects on page refresh (token exists but user not yet fetched)
- SSR always renders unauthenticated state; client hydration picks up auth from `localStorage`

---

## Layout Pattern with Nested Routes

The admin section uses a parent `<Route>` with `<Outlet />` for shared layout (`routes/protected/admin/Layout.tsx`):

```tsx
import { Link, Outlet, useLocation } from 'react-router';
const navItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export const AdminLayout = () => {
  const location = useLocation();
  // No auth guard here — ProtectedLayout handles it at the route level
  // Render navItems as Links, using location.pathname === item.path for active state
  return (
    <div className="min-h-screen bg-background flex">
      <aside>{/* sidebar nav using navItems + active detection */}</aside>
      <main className="flex-1 p-8">
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  );
};
```

- `<Outlet />` renders matched child route; layout wraps ALL `/admin/*` routes. `navItems` array drives sidebar.

---

## Adding a New Route (Step-by-Step)

1. Pick group folder based on auth requirement (`guest/`, `public/`, or `protected/`)
2. Create component file + barrel export (`index.ts`) in the subfolder
3. Add `<Route>` in `routes/index.tsx` — if protected, nest under `<ProtectedLayout />`
4. Add navigation link in relevant nav component

### Example: Adding `/admin/reports`

```tsx
// 1. Create routes/protected/admin/reports/Reports.page.tsx + barrel index.ts
export const AdminReports = () => <div>Reports Page</div>;

// 2. Add route inside admin layout in routes/index.tsx
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="users" element={<AdminUsers />} />
  <Route path="settings" element={<AdminSettings />} />
  <Route path="reports" element={<AdminReports />} /> {/* new */}
</Route>;

// 3. Add to navItems in AdminLayout
navItems.push({ path: '/admin/reports', label: 'Reports', icon: '📈' });
```

---

## File Structure

```
frontend/src/
├── entry-client.tsx           # BrowserRouter + hydrateRoot
├── entry-server.tsx           # StaticRouter + renderToString
├── App.tsx                    # Root component → <AppRoutes />
└── routes/
    ├── index.tsx              # Single source of truth for route definitions
    ├── guest/
    │   ├── Layout.tsx         # GuestLayout — redirects authed users
    │   ├── index.ts
    │   └── landing/
    │       ├── Landing.page.tsx
    │       └── index.ts
    ├── public/
    │   └── examples/
    │       ├── Examples.page.tsx
    │       └── index.ts
    └── protected/
        ├── Layout.tsx         # ProtectedLayout — redirects unauthed users
        ├── index.ts
        ├── dashboard/
        └── admin/
            ├── Layout.tsx     # AdminLayout — sidebar + Outlet
            ├── index.ts
            ├── dashboard/
            ├── users/
            └── settings/
```

> See **frontend-components** skill for atomic design structure, file splitting rules, and route-scoped component conventions.

---

## Project Conventions

- **Single package**: All imports from `'react-router'` (not `react-router-dom`)
- **Declarative only**: Use `<Link>` and `<Navigate>`, NOT `useNavigate()`
- **Layout-based guards**: Auth protection via `ProtectedLayout`/`GuestLayout` wrapping route groups — never inline in page components
- **Route grouping**: Routes organized into `guest/`, `public/`, `protected/` by auth requirement
- **Single source of truth**: `routes/index.tsx` is the single source of truth for all route definitions
- **Hardcoded paths**: Route paths are string literals (no constants file)
- **Layout nesting**: Use parent `<Route>` + `<Outlet>` for shared layouts
- **SSR-safe state**: Always check `typeof window` before accessing browser APIs in stores
- **Replace flag**: Always use `replace` prop on `<Navigate>` for auth redirects to prevent back-button loops
- **Active detection**: Use exact `===` match on `location.pathname` for active link styling

---

## Quick Reference

| Task                  | Code/Pattern                                                                  |
| --------------------- | ----------------------------------------------------------------------------- |
| Import router         | `import { Link, Navigate, Routes, Route } from 'react-router'`                |
| Add a link            | `<Link to="/path">Text</Link>`                                                |
| Redirect (auth guard) | `<Navigate to="/" replace />`                                                 |
| Check active route    | `const { pathname } = useLocation()`                                          |
| Nested layout         | Parent `<Route element={<Layout />}>` + `<Outlet />` in Layout                |
| Protect a route       | Nest under `<Route element={<ProtectedLayout />}>` in route definitions       |
| Add admin page        | Create component -> add `<Route>` inside admin `<Route>` -> add to `navItems` |
| Route definitions     | `frontend/src/routes/index.tsx`                                               |
