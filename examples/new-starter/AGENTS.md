# Axolotl Fullstack - LLM Integration Guide

## Overview

This is a fullstack project with an **Axolotl GraphQL backend** and a **React frontend**.

- **Backend**: Axolotl - a type-safe, schema-first GraphQL framework that generates TypeScript types from your schema
- **Frontend**: React + Vite + Tailwind CSS v4 + shadcn/ui + Zustand + Zeus (type-safe GraphQL client) + Sonner (toasts)

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
├── axolotl.json          # Configuration file
├── schema.graphql        # GraphQL schema
├── src/
│   ├── axolotl.ts       # Framework initialization
│   ├── models.ts        # Auto-generated types (DO NOT EDIT)
│   ├── resolvers.ts     # Resolver implementations
│   └── index.ts         # Server entry point
```

### Critical Rules

**ALWAYS follow these rules when working with Axolotl:**

1. **NEVER edit models.ts manually** - always regenerate with `axolotl build`
2. **ALWAYS use .js extensions** in imports (ESM requirement)
3. **ALWAYS run axolotl build** after schema changes
4. **CRITICAL: Resolver signature is** `(input, args)` where `input = [source, args, context]`
5. **CRITICAL: Access context as** `input[2]` or `([, , context])`
6. **CRITICAL: Access parent/source as** `input[0]` or `([source])`
7. **CRITICAL: Context type must** extend `YogaInitialContext` and spread `...initial`
8. **Import from axolotl.ts** - never from @aexol/axolotl-core directly in resolver files
9. **Use createResolvers()** for ALL resolver definitions
10. **Use mergeAxolotls()** to combine multiple resolver sets
11. **Return empty object `{}`** for nested resolver enablement
12. **Context typing** requires `graphqlYogaWithContextAdapter<T>(contextFunction)`

### Understanding axolotl.json

The `axolotl.json` configuration file defines:

```json
{
  "schema": "schema.graphql",
  "models": "src/models.ts",
  "federation": [
    {
      "schema": "src/todos/schema.graphql",
      "models": "src/todos/models.ts"
    }
  ],
  "zeus": [
    {
      "generationPath": "src/"
    }
  ]
}
```

**Instructions:**

- Read `axolotl.json` first to understand project structure
- NEVER edit `axolotl.json` unless explicitly asked
- Use paths from config to locate schema and models

### Backend Workflow Checklist

1. **Read axolotl.json** to understand structure
2. **Check schema.graphql** for current schema
3. **Verify models.ts is up-to-date** (regenerate if needed)
4. **Locate axolotl.ts** to understand initialization
5. **Find resolver files** and understand structure
6. **Make schema changes** if requested
7. **Run `axolotl build`** after schema changes
8. **Optionally run `axolotl resolvers`** to scaffold new resolver files
9. **Update resolvers** to match new types
10. **Test** that server starts without type errors

### Backend Troubleshooting

#### Type errors in resolvers

**Solution:** Run `npx @aexol/axolotl build` to regenerate models

#### Scalar types showing as 'unknown'

**Solution:** Map scalars in axolotl.ts:

```typescript
Axolotl(adapter)<Models<{ MyScalar: string }>, Scalars>();
```

#### Context type not recognized

**Solution:** Use `graphqlYogaWithContextAdapter<YourContextType>(contextFunction)`

#### Context properties undefined

**Solution:** Make sure you spread `...initial` when building context

### Backend Quick Reference

| Task                 | Command/Code                                                |
| -------------------- | ----------------------------------------------------------- |
| Initialize project   | `npx @aexol/axolotl create-yoga <name>`                     |
| Generate types       | `npx @aexol/axolotl build`                                  |
| Scaffold resolvers   | `npx @aexol/axolotl resolvers`                              |
| Create resolvers     | `createResolvers({ Query: {...} })`                         |
| Access context       | `([, , context])` - third in tuple                          |
| Access parent        | `([source])` - first in tuple                               |
| Merge resolvers      | `mergeAxolotls(resolvers1, resolvers2)`                     |
| Start server         | `adapter({ resolvers }).server.listen(4000)`                |
| Add custom context   | `graphqlYogaWithContextAdapter<Ctx>(contextFn)`             |
| Context must extend  | `YogaInitialContext & { custom }`                           |
| Context must include | `{ ...initial, ...custom }`                                 |
| Define scalars       | `createScalars({ ScalarName: GraphQLScalarType })`          |
| Define directives    | `createDirectives({ directiveName: mapper })`               |
| Inspect resolvers    | `npx @aexol/axolotl inspect -s schema.graphql -r resolvers` |

---

## Frontend (React + Zeus)

### Project Structure

```
frontend/
├── src/
│   ├── api/                 # GraphQL client layer
│   │   ├── client.ts        # Chain client creation
│   │   ├── query.ts         # Query helper
│   │   ├── mutation.ts      # Mutation helper
│   │   ├── subscription.ts  # Subscription helper
│   │   └── index.ts         # Re-exports
│   ├── components/          # React components
│   │   ├── AuthForm.tsx
│   │   ├── Header.tsx
│   │   ├── TodoForm.tsx
│   │   ├── TodoItem.tsx
│   │   ├── TodoList.tsx
│   │   └── index.ts
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts       # Authentication logic
│   │   ├── useTodos.ts      # Todo CRUD operations
│   │   ├── useTodoSubscription.ts
│   │   └── index.ts
│   ├── routes/              # Page components
│   │   ├── Dashboard.tsx
│   │   └── Landing.tsx
│   ├── stores/              # Zustand state stores
│   │   ├── authStore.ts     # Auth state (token, user)
│   │   └── index.ts
│   ├── zeus/                # Auto-generated (DO NOT EDIT)
│   │   ├── const.ts
│   │   └── index.ts
│   ├── types.ts             # Shared TypeScript types
│   ├── App.tsx              # Root component
│   ├── entry-client.tsx     # Client hydration entry
│   └── entry-server.tsx     # SSR render entry
├── index.html
└── tsconfig.json
```

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
3. **Use Zustand stores** for shared state (auth, UI state)
4. **SSR-safe code** - check `typeof window` before accessing browser APIs
5. **Use hooks** for data fetching logic - keep components presentational
6. **ALWAYS define Selectors** for reusable query shapes
7. **ALWAYS use `FromSelector`** to derive TypeScript types from selectors
8. **NEVER manually duplicate backend types** - derive them from selectors
9. **Use `$` function** for GraphQL variables when values come from user input or props
10. **ALWAYS use semantic color tokens** (`bg-primary`, `text-muted-foreground`, `border-border`, etc.) — avoid hardcoded Tailwind colors (`bg-blue-500`, `text-gray-400`) as they won't respond to theme changes
11. **PascalCase for React component files** — `AuthForm.tsx`, `ThemeProvider.tsx`, `TodoList.tsx`. Hooks use `use` prefix with camelCase: `useAuth.ts`, `useTodos.ts`
12. **Route pages use `.page.tsx` suffix** — each route gets its own folder with the page file inside: `routes/landing/Landing.page.tsx`, `routes/dashboard/Dashboard.page.tsx`. Sub-page content without its own route stays as regular `.tsx`
13. **ALWAYS use arrow functions** — `const MyComponent = () => {}` instead of `function MyComponent() {}`. Applies to components, hooks, handlers, helpers — everything. Only exception: generator functions (`function*`)

### Component Architecture

- **Atomic design** for reusable components — organize in `components/atoms/`, `components/molecules/`, `components/organisms/`. Exception: shadcn/ui stays in `components/ui/`
- **File splitting at 400–500 lines** — extract hooks (`useComponentName.ts`), schemas (`.schema.ts`), types (`.types.ts`), data (`.data.ts`), or sub-components. All partitions live next to the component file
- **Reusability-first** — any component with the slightest chance of reuse belongs in the atomic design system with configurable props
- **Route-scoped components** — components used by only one route live in `routes/{route}/components/`. If they grow too large, same splitting rules apply recursively
- **Promote when shared** — if a route-scoped component starts being used by multiple routes, move it to the atomic design system
- **Co-located hooks** — extracted component hooks live next to their component (e.g., `AuthForm.tsx` + `useAuthForm.ts`), distinct from shared data-fetching hooks in `hooks/`

> **Full guide:** Load the `frontend-components` skill for detailed patterns, examples, and decision flowchart.

### Toast Notifications (Sonner)

This project uses **Sonner** (`sonner`) for toast notifications. Import `toast` directly from sonner:

```typescript
import { toast } from 'sonner';

// Usage
toast.success('Todo created!');
toast.error('Failed to delete todo');
toast.info('Session expired, please log in again');
toast('Default notification');
```

**Rules:**

- Always use `sonner` for toasts - do NOT create custom toast stores or components
- Use semantic methods: `toast.success()`, `toast.error()`, `toast.info()`
- Keep messages short and user-friendly
- The `<Toaster />` component is already mounted in the app root

### Frontend Troubleshooting

#### Type errors after schema changes

**Solution:** Regenerate Zeus by running `npx @aexol/axolotl build` in the project root

#### Zeus files not found

**Solution:** Ensure `axolotl.json` has zeus configuration:

```json
{
  "zeus": [
    {
      "generationPath": "frontend/src",
      "esModule": true
    }
  ]
}
```

#### SSR hydration mismatch

**Solution:** Ensure state that differs between server/client is handled with SSR-safe storage checks (`typeof window === 'undefined'`).

#### Auth token not persisting

**Solution:** Check that Zustand persist middleware is configured with SSR-safe storage.

### Frontend Quick Reference

| Task                   | Code                                                    |
| ---------------------- | ------------------------------------------------------- |
| Create query           | `query()({ user: { todos: { _id: true } } })`           |
| Create mutation        | `mutation()({ login: [{ username, password }, true] })` |
| Access auth state      | `useAuthStore((s) => s.token)`                          |
| Show toast (sonner)    | `toast.success('Done!')`                                |
| Mutation with args     | `mutation()({ field: [{ arg: value }, selector] })`     |
| Return scalar directly | `field: [{ args }, true]`                               |

---

**Before writing any code, always check available skills for detailed guidance on the topic you're working on.**
