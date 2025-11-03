# next — README (from repo)

# Next.js

## Overview

Next.js is a full‑stack React framework that lets you build modern web applications with:

- File‑system routing (App Router and Pages Router)
- Server and Client Components (React 19 canary support built in)
- Data fetching, caching, and streaming (Suspense, loading UI, Server Functions)
- Pre‑rendering (static and dynamic) with fine‑grained revalidation
- Fast dev and build tooling (Turbopack by default, opt‑in Webpack)
- First‑class TypeScript, linting, and module alias support
- Built‑in APIs (Route Handlers), Images, Fonts, and more

Use it to create fast, production‑grade apps with minimal configuration.

References in this guide point to canonical docs under the repo’s `docs/01-app/**` and API references.

---

## Installation

Requirements:
- Node.js 20.9 or later (macOS, Windows/WSL, or Linux).

Create a new app with the CLI:
```bash
# pnpm
pnpm create next-app@latest my-app

# npm
npx create-next-app@latest my-app

# yarn
yarn create next-app@latest my-app

# bun
bun create next-app@latest my-app
```
By default, the CLI enables TypeScript, Tailwind, the App Router, Turbopack, and an `@/*` import alias (docs: `installation.mdx`).

Manual install (existing project):
```bash
# pnpm
pnpm i next@latest react@latest react-dom@latest

# npm
npm i next@latest react@latest react-dom@latest
```

Add scripts to `package.json`:
```json
{
  "scripts": {
    "dev": "next dev",           // Turbopack dev server by default
    "build": "next build",       // Production build
    "start": "next start",       // Production server
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```
To use Webpack: `next dev --webpack` or `next build --webpack` (docs: installation).

---

## Quick Start

Minimal App Router setup (`app` directory):

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

// app/page.tsx
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

Run the dev server:
```bash
npm run dev
# http://localhost:3000
```

Notes:
- The root `layout.tsx` is required and must include `<html>` and `<body>`.
- Create a `public/` folder for static assets accessible from `/` (docs: installation, project-structure).

---

## Key Features

### 1) File-system Routing (App Router)
- Routes are folders in `app/` with special files:
  - `page.tsx` (route UI), `layout.tsx` (shared UI), `loading.tsx` (skeleton), `error.tsx`, `not-found.tsx`, `route.ts` (API), `template.tsx`, `default.tsx`.
- Advanced patterns:
  - Dynamic routes `[slug]`, catch‑all `[...slug]`, optional `[[...slug]]`
  - Route groups `(group)` for organizing without affecting URLs
  - Private folders `_folder` to colocate non‑routable code
  - Parallel routes with `@slot` and intercepted routes `(.)`, `(..)`, `(...)`
(docs: project-structure, layouts-and-pages).

### 2) Server and Client Components
- Server Components (default):
  - Fetch server‑side data securely and stream it (Suspense/`loading.tsx`)
  - Lower JS sent to the browser; faster initial paint
- Client Components (opt‑in with `"use client"`):
  - Use state, effects, event handlers, browser APIs
  - Props passed from Server → Client must be serializable
(docs: server-and-client-components).

### 3) Data Fetching, Caching, and Streaming
- Fetch in Server Components with `fetch` or an ORM/DB client.
- Streaming:
  - `loading.tsx` for entire route; or `<Suspense>` for granular parts
  - Prefetch + stream dynamic UI for fast, responsive navigation
- Caching:
  - `fetch(url, { cache: 'force-cache' | 'no-store', next: { revalidate } })`
  - `use cache` directive + `cacheLife('seconds'|'minutes'|'hours'|'days')`
  - Tag cached data with `cacheTag()` and refresh with `revalidateTag()` or `updateTag()` (immediate in Server Actions)
(docs: fetching-data, caching-and-revalidating, cache-components).

### 4) Navigation Optimizations
- `<Link href="/path" />` prefetches routes in viewport for instant transitions.
- For dynamic routes, add `loading.tsx` to partially prefetch shell (fallback UI) and stream content.
- Use `useLinkStatus()` for slow networks to indicate pending transitions.
(docs: linking-and-navigating).

### 5) Mutations with Server Functions (Server Actions)
- Define async functions with `"use server"`, invoke from forms (`action`) or buttons (`formAction`) in Client Components.
- Compose with cache invalidation (`revalidatePath`, `revalidateTag`, `updateTag`) and `redirect`.
(docs: updating-data).

### 6) TypeScript & Tooling
- TS is first‑class; enable the Next.js TypeScript plugin in VS Code (“Use Workspace Version”).
- Linting: ESLint or Biome. From Next 16+, `next build` doesn’t run lint by default—run via scripts.
- Absolute imports & aliases via `tsconfig.json` / `jsconfig.json` (`baseUrl`, `paths`).
(docs: installation).

### 7) API Routes (Route Handlers)
- `app/**/route.ts` for REST endpoints.
- Use Node runtime by default; integrates with caching (`use cache`, `cacheLife`); runtime APIs like `cookies()`/`headers()` keep the handler dynamic.
(docs: route handlers under “backend for frontend” in repo docs).

### 8) Turbopack (Default)
- Next dev uses Turbopack by default; switch with `--webpack` as needed (docs: installation).

---

## Configuration

### next.config.{js,ts}
Common configurations (docs: `next-config-js`):
- `cacheComponents: true` — enables Cache Components (PPR). With it:
  - Pages are dynamic by default.
  - Use `use cache` + `cacheLife` to include data in the pre‑rendered shell.
  - Wrap dynamic/runtime work in `<Suspense>`.
  - Do not use `dynamic = 'force-static'` / `'force-dynamic'`, `revalidate`, or `fetchCache` segment configs; replace with `use cache` APIs.
```ts
// next.config.ts
import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  cacheComponents: true,
}
export default nextConfig
```

### TypeScript plugin (VS Code)
- Command palette → “TypeScript: Select TypeScript Version” → “Use Workspace Version” (docs: installation).

### Absolute imports
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "src/",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/styles/*": ["styles/*"]
    }
  }
}
```

### Linting
- ESLint example:
```json
{
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```
- Migrate from `next lint` with: `npx @next/codemod@canary next-lint-to-eslint-cli .` (docs: installation).

---

## Common Pitfalls & How to Avoid Them

- “Why is navigation to a dynamic page slow?”
  - Add `loading.tsx` to enable partial prefetch + streaming.
  - Use `<Suspense>` for granular streaming; avoid blocking the whole route.
  - Use `generateStaticParams` for known dynamic segments when applicable.

- “My Client Component can’t access Server‑only APIs”
  - Don’t use secrets or `process.env.*` in Client Components. Mark server‑only modules with `import 'server-only'` to catch accidental client usage.

- “Props to Client Components must be serializable”
  - Only pass primitives/serializable JSON. Don’t pass functions, class instances, non‑serializable objects.

- “Dynamic error on accessing runtime data while pre‑rendering”
  - Keep runtime APIs (`cookies()`, `headers()`, `searchParams`) inside Suspense‑wrapped components to stream them; do not use them in `use cache` scopes.

- “Edge runtime with Cache Components”
  - Cache Components requires Node.js runtime (docs: cache-components). Edge runtime is unsupported with `cacheComponents: true`.

- “Forgot root layout”
  - `app/layout.tsx` is required and must include `<html>` and `<body>`.

- “TypeScript IntelliSense incomplete”
  - Enable “Use Workspace Version” and run `next dev` once so the helper types (`PageProps`/`LayoutProps`) are generated, or run `next typegen` (docs: layouts-and-pages).

---

## Examples

### Routing Basics

```tsx
// app/blog/page.tsx
export default async function BlogIndex() {
  const res = await fetch('https://api.vercel.app/blog')
  const posts: { id: string; title: string }[] = await res.json()
  return (
    <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
  )
}

// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const res = await fetch(`https://api.vercel.app/blog/${slug}`)
  if (!res.ok) notFound()
  const post = await res.json()
  return <article><h1>{post.title}</h1></article>
}
```

### Navigation and Prefetching
```tsx
// app/layout.tsx
import Link from 'next/link'
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <nav>
          <Link href="/blog">Blog</Link>
          <a href="/contact">Contact</a> {/* no prefetch */}
        </nav>
        {children}
      </body>
    </html>
  )
}
```

### Streaming with `loading.tsx` and Suspense
```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div>Loading...</div> // fallback UI
}

// app/dashboard/page.tsx
import { Suspense } from 'react'

async function DynamicPanel() {
  const data = await fetch('https://api.example.com/data').then(r => r.json())
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

export default function Page() {
  return (
    <>
      <h1>Dashboard</h1>
      <Suspense fallback={<div>Loading panel…</div>}>
        {/* streamed chunk */}
        <DynamicPanel />
      </Suspense>
    </>
  )
}
```

### Server vs Client Components

```tsx
// app/ui/like-button.tsx
'use client'
import { useState } from 'react'
export default function LikeButton({ likes }: { likes: number }) {
  const [count, setCount] = useState(likes)
  return <button onClick={() => setCount(c => c + 1)}>{count} Likes</button>
}

// app/[id]/page.tsx
import LikeButton from '@/app/ui/like-button'
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await fetch(`https://api.vercel.app/posts/${id}`).then(r => r.json())
  return <>
    <h1>{post.title}</h1>
    <LikeButton likes={post.likes} />
  </>
}
```

### Caching with `use cache`, `cacheLife`, and Tags

```tsx
// app/products/page.tsx
import { cacheLife, cacheTag, revalidateTag } from 'next/cache'

// Cache this page output for 1 hour and tag for selective revalidation
export default async function Page() {
  'use cache'
  cacheLife('hours')
  cacheTag('products')

  const products = await fetch('https://api.example.com/products').then(r => r.json())
  return <ul>{products.map((p: any) => <li key={p.id}>{p.name}</li>)}</ul>
}

// app/actions.ts
'use server'
import { revalidateTag } from 'next/cache'
export async function createProduct(formData: FormData) {
  // write to DB...
  revalidateTag('products', 'max') // SWR-style refresh
}
```

#### Immediate “read‑your‑own‑write” with `updateTag` in Server Actions

```tsx
// app/actions.ts
'use server'
import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  // write to DB...
  updateTag('posts') // expire cached entries immediately
  redirect('/posts')
}
```

### Fetch Cache & Revalidate

```tsx
// Cache this GET and revalidate every 3600s
const res = await fetch('https://api.example.com/list', {
  cache: 'force-cache',
  next: { revalidate: 3600 },
})
```

### Route Handler with Caching

```tsx
// app/api/products/route.ts
import { cacheLife } from 'next/cache'

export async function GET() {
  const products = await getProducts()
  return Response.json(products)
}

async function getProducts() {
  'use cache'
  cacheLife('hours')
  return await db.query('SELECT * FROM products')
}
```

### Server Functions (Server Actions)

```tsx
// app/actions.ts
'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(prev: any, formData: FormData) {
  // create post...
  revalidatePath('/posts')
  redirect('/posts')
}

// app/ui/form.tsx
'use client'
import { useActionState } from 'react'
import { createPost } from '@/app/actions'

const initial = { message: '' }
export function PostForm() {
  const [state, action, pending] = useActionState(createPost, initial)
  return (
    <form action={action}>
      <input name="title" required />
      <textarea name="content" required />
      {state?.message && <p>{state.message}</p>}
      <button disabled={pending}>Create</button>
    </form>
  )
}
```

### Parallel Data Fetch

```tsx
// app/artist/[username]/page.tsx
async function getArtist(u: string) { return fetch(`https://api/artist/${u}`).then(r=>r.json()) }
async function getAlbums(u: string) { return fetch(`https://api/artist/${u}/albums`).then(r=>r.json()) }

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const artistData = getArtist(username)  // start both
  const albumsData = getAlbums(username)
  const [artist, albums] = await Promise.all([artistData, albumsData])
  return <>
    <h1>{artist.name}</h1>
    <ul>{albums.map((a: any) => <li key={a.id}>{a.name}</li>)}</ul>
  </>
}
```

### 404 and Redirects

```tsx
import { notFound, redirect } from 'next/navigation'
if (!data) notFound()
if (needsLogin) redirect('/login')
```

---

## Links

- Docs (App Router): `docs/01-app/**` in this repo; starting points:
  - Getting Started:
    - Installation: `docs/01-app/01-getting-started/01-installation.mdx`
    - Project Structure: `02-project-structure.mdx`
    - Layouts & Pages: `03-layouts-and-pages.mdx`
    - Linking & Navigating: `04-linking-and-navigating.mdx`
    - Server & Client Components: `05-server-and-client-components.mdx`
    - Cache Components (PPR): `06-cache-components.mdx`
    - Fetching Data: `07-fetching-data.mdx`
    - Updating Data (Server Functions): `08-updating-data.mdx`
    - Caching & Revalidating: `09-caching-and-revalidating.mdx`
    - Error Handling: `10-error-handling.mdx`
- API References:
  - `app/api-reference/file-conventions/*` (layout, page, loading, error, route, not-found, etc.)
  - `app/api-reference/functions/*` (fetch, revalidatePath, revalidateTag, updateTag, cacheLife, cacheTag, connection, cookies, headers, redirect, notFound)
  - `app/api-reference/directives/use-cache`
  - `app/api-reference/components/link`
  - `app/api-reference/config/next-config-js/*` (cacheComponents, eslint, typescript, turbopack)
- Official site: https://nextjs.org/docs
- Repo: https://github.com/vercel/next.js

--- 

Use this doc as a compact, production‑oriented reference. For deeper dives, follow the linked files under `docs/01-app/**` within the repository.