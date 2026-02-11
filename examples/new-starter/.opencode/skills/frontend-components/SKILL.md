---
name: frontend-components
description: Frontend component architecture - atomic design, file splitting (~300 line target, hard max 400 lines), reusability principles, route-scoped components, and co-located partitions
---

# Frontend Component Architecture

## 1. Atomic Design Structure

Reusable components follow atomic design inside `frontend/src/components/`:

```
components/
├── atoms/           # Smallest reusable UI pieces — no custom component children
│   ├── EmptyState.tsx
│   ├── StatusBadge.tsx
│   ├── LoadingSpinner.tsx
│   └── index.ts
├── molecules/       # Reusable compositions of atoms, single responsibility
│   ├── SearchBar.tsx
│   ├── ConfirmDialog.tsx
│   ├── UserAvatar.tsx
│   └── index.ts
├── organisms/       # Large reusable sections — compose multiple molecules and atoms
│   ├── DataTable.tsx
│   ├── Sidebar.tsx
│   └── index.ts
├── global/          # App-wide components — layouts, providers, navigation, footer
│   ├── TopNav.tsx
│   ├── Footer.tsx
│   ├── ThemeProvider.tsx
│   ├── Layout.tsx
│   └── index.ts
└── ui/              # shadcn/ui primitives — DO NOT move into atomic folders
    ├── Button.tsx
    ├── Input.tsx
    └── ...
```

### Classification Guide

| Level         | What belongs                                                  | Examples                                               |
| ------------- | ------------------------------------------------------------- | ------------------------------------------------------ |
| **Atoms**     | Smallest reusable UI, no custom component children            | `EmptyState`, `StatusBadge`, `LoadingSpinner`, `Badge` |
| **Molecules** | Reusable compositions of atoms, single responsibility         | `SearchBar`, `ConfirmDialog`, `UserAvatar`, `Dropdown` |
| **Organisms** | Large reusable sections, compose multiple molecules and atoms | `DataTable`, `Sidebar`, `UserProfile`, `FilterPanel`   |
| **Global**    | App-wide: layouts, providers, navigation, footer              | `TopNav`, `Footer`, `ThemeProvider`, `Layout`          |

> **⚠️ Critical:** Components that are specific to a single route/page do **NOT** belong in the atomic design system regardless of their complexity. A 200-line form for a specific page goes in `routes/{route}/components/`, not in `molecules/`. Only genuinely reusable, generic components belong here.

**Rules:**

1. Each atomic folder gets an `index.ts` barrel export
2. shadcn/ui components stay in `components/ui/` — they are the project's design system primitives
3. When unsure between atom/molecule: if it composes other custom components → molecule
4. When unsure between molecule/organism: if it manages its own data fetching or complex state → organism

---

## 2. File Splitting (Hard Max 400 Lines, Target ~300 Per File)

Component files **cannot exceed 400 lines**. Target **~300 lines per file**. If a file hits 400, it must be split. The goal is ~300 lines of meaningful code — NOT the maximum number of tiny files.

**Key sizing rules:**

- **Hard max:** 400 lines — split immediately when reached
- **Target per file after split:** ~300 lines
- **Minimum sub-component size:** 150 lines — hard minimum, no exceptions. A component file under 150 lines should not exist as a standalone file.
- **300–400 lines is the sweet spot** — a 350-line component is ideal, a 400-line component needs attention

### Splitting Priority (MANDATORY ORDER)

Extract in this order. **NEVER skip to sub-components before exhausting steps 1–4.**

1. **Extract logic → hook** — `useComponentName.ts` — state, effects, callbacks, useMemos, event handlers
2. **Extract static/config data** — `ComponentName.data.ts` — arrays, navigation items, column definitions, config objects
3. **Extract Zod/RHF schemas** — `ComponentName.schema.ts` — Zod schemas, form validation, type inference
4. **Extract TypeScript types** — `ComponentName.types.ts` — interfaces, type aliases, enums

5. **Extract sub-components — LAST RESORT ONLY** — allowed ONLY when steps 1–4 are already done AND the file STILL exceeds 400 lines. Each extracted sub-component MUST be 150+ lines. No exceptions. Sub-components live in a `components/` subfolder.

### Example: Splitting a Large Component

**Before** — single 600-line file:

```
routes/examples/
├── components/
│   └── ComponentShowcase.tsx    # 628 lines — too large
```

**After** — split into logical partitions (~300 lines each):

```
routes/examples/
├── components/
│   └── component-showcase/              # Folder named after the component (kebab-case)
│       ├── ComponentShowcase.tsx         # ~300 lines — main component with render + layout
│       ├── useComponentShowcase.ts       # Hook with state, handlers, memos
│       ├── ComponentShowcase.data.ts     # Static showcase items, option arrays
│       ├── ComponentShowcase.types.ts    # TypeScript interfaces
│       └── components/                   # Sub-components (only if still needed after above extractions)
│           ├── ButtonShowcase.tsx        # ~150+ lines each
│           └── FormShowcase.tsx
```

### Folder Structure for Split Components

When a component needs splitting, create a folder for it:

- **Folder name** is the kebab-case version of the component name: `ComponentShowcase.tsx` → `component-showcase/`
- **Main `.tsx` file** lives INSIDE its own folder, not beside it
- **Co-located partitions** (hooks, schemas, types, data) also live inside the component's folder
- **Sub-components ALWAYS go in a `components/` subfolder** — never place them directly next to the parent component file. `component-showcase/DataNavigationOverlays.tsx` is WRONG. Correct: `component-showcase/components/DataNavigationOverlays.tsx`
- **Only create a folder** when the component actually needs splitting — small components stay as single files
- **Recursive**: if a sub-component itself needs splitting, it gets its own folder inside `components/`

### Naming Conventions

| Partition  | File name                      | Example                  |
| ---------- | ------------------------------ | ------------------------ |
| Logic hook | `use{ComponentName}.ts`        | `useAuthForm.ts`         |
| Schema     | `{ComponentName}.schema.ts`    | `AuthForm.schema.ts`     |
| Types      | `{ComponentName}.types.ts`     | `AuthForm.types.ts`      |
| Data       | `{ComponentName}.data.ts`      | `TopNav.data.ts`         |
| Constants  | `{ComponentName}.constants.ts` | `Dashboard.constants.ts` |
| Store      | `{ComponentName}.store.ts`     | `Examples.store.ts`      |

### Co-Located Partitions Require a Folder

> **🔴 RULE: When a component has ANY co-located partition (hook, schema, data, types, constants), it MUST be placed inside its own kebab-case folder with a barrel `index.ts`.** Only components that are a single `.tsx` file with NO co-located files may remain as standalone files without a folder.

This applies regardless of whether the component itself exceeds 400 lines. The moment you extract a hook, schema, data file, types file, or constants file, the component and all its partitions move into a folder.

```
✅ CORRECT — component with hook gets its own folder:
components/
├── forms-showcase-tab/          # Has co-located hook → folder required
│   ├── FormsShowcaseTab.tsx
│   ├── useFormsShowcase.ts
│   └── index.ts
└── DataDisplaySection.tsx       # No co-located files → stays as single file

❌ WRONG — component with hook sitting loose:
components/
├── FormsShowcaseTab.tsx
├── useFormsShowcase.ts          # Hook next to component without a folder!
└── DataDisplaySection.tsx
```

---

## 3. Reusability Principle

**Rule:** A component belongs in the atomic design system if ANY of these is true:

- It is **genuinely generic** — works with any data on any page (e.g., `CodeSnippet`, `EmptyState`, `ConfirmDialog`). This is true even if only one route currently uses it.
- It is **used by multiple routes/parents**

Generic components go in atomic design **immediately** — don't keep them route-scoped "until reuse emerges." A component like `CodeSnippet` that takes a `code` string and renders a styled `<pre>` block is obviously generic — it belongs in `atoms/` from day one, even if only the examples route uses it today.

Everything else is **route-scoped by default**. The [Promotion Rule](#promotion-rule) handles cases where a route-scoped component later turns out to be needed elsewhere.

### What Goes WHERE

| Component       | Reusable? | Where it belongs                         | Why                                                          |
| --------------- | --------- | ---------------------------------------- | ------------------------------------------------------------ |
| `EmptyState`    | ✅ Yes    | `components/atoms/`                      | Generic — works for any empty list/state on any page         |
| `ConfirmDialog` | ✅ Yes    | `components/molecules/`                  | Generic — any destructive action on any page can use it      |
| `DataTable`     | ✅ Yes    | `components/organisms/`                  | Generic — works with any data shape on any page              |
| `AuthForm`      | ❌ No     | `routes/guest/landing/components/`       | Tied to login/register business logic — only Landing uses it |
| `TodoForm`      | ❌ No     | `routes/protected/dashboard/components/` | Tied to todo creation — only Dashboard uses it               |
| `SettingsPanel` | ❌ No     | `routes/protected/settings/components/`  | Specific to settings page                                    |

---

## 4. Route-Scoped Components

Components that **only live inside a single page/route** should NOT be in the global `components/` folder. Instead, co-locate them.

### Structure

Every route gets its own folder. The page file uses `.page.tsx` suffix and lives inside it.

```
routes/
├── index.tsx                    # Single source of truth — all route definitions here
├── guest/                       # Routes for unauthenticated users only
│   ├── Layout.tsx               # GuestLayout — auth guard
│   ├── index.ts
│   └── landing/
│       ├── Landing.page.tsx
│       ├── index.ts
│       └── components/
│           └── AuthForm.tsx
├── public/                      # Routes visible to everyone
│   └── examples/
│       ├── Examples.page.tsx
│       ├── index.ts
│       └── components/
│           ├── FormShowcase.tsx                  # Small → single file
│           └── component-showcase/              # Large → folder with components/ subfolder
│               ├── ComponentShowcase.tsx
│               └── components/
│                   └── DataNavigationOverlays.tsx
└── protected/                   # Routes requiring authentication
    ├── Layout.tsx               # ProtectedLayout — auth guard
    ├── index.ts
    ├── dashboard/
    │   ├── Dashboard.page.tsx
    │   ├── index.ts
    │   └── components/
    │       ├── TodoForm.tsx
    │       └── TodoList.tsx
    └── admin/
        ├── Layout.tsx
        └── dashboard/
            ├── Dashboard.page.tsx
            └── index.ts
```

> **Route Grouping Convention:** Routes are organized into `guest/`, `public/`, `protected/` folders based on auth requirements. `routes/index.tsx` is the **single source of truth** for route definitions and protection — folder grouping is a co-location convenience, not the enforcement mechanism. Route-scoped component rules apply identically regardless of which group a route belongs to.

### Promotion Rule

If a route-scoped component starts being used by **multiple routes**, promote it to the atomic design system:

1. Move from `routes/{group}/{route}/components/` → `components/atoms|molecules|organisms/`
2. Add proper configurable props
3. Export from barrel `index.ts`
4. Update all imports

---

## 5. Decision Flowchart

When creating or refactoring a component, follow this decision tree:

```
Is this a shadcn/ui primitive?
├── YES → components/ui/ (do not touch)
└── NO ↓

Is this an app-wide component (layout, provider, nav, footer)?
├── YES → components/global/
└── NO ↓

Is this component CURRENTLY used by 2+ routes, OR is it genuinely generic
(works with any data, any page — e.g., EmptyState, ConfirmDialog, DataTable)?
├── YES → components/atoms|molecules|organisms/
└── NO ↓

Is this a form/section tied to specific business logic
(login form, todo form, settings panel, user profile editor)?
├── YES → routes/{route}/components/ — these are almost NEVER reusable
└── NO ↓

Is this component only used by one route?
├── YES → routes/{route}/components/
└── NO → Reconsider — it may be generic after all → components/atoms|molecules|organisms/

Is the file > 400 lines?
├── NO → Keep as single file (300–400 lines is perfectly fine)
└── YES ↓

Split following priority: hook → data → schema → types → sub-components
  Target ~300 lines per resulting file
  ↓
Would a proposed sub-component be < ~150 lines?
├── YES → Don't extract it — group it with related UI to reach ~300 lines
└── NO → Extract it into the component's components/ subfolder

Does the component now need a folder (has partitions or sub-components)?
├── YES → Create kebab-case folder, move main file INSIDE it
└── NO → Keep as single file
```

---

> **🔴 CRITICAL: NEVER create thin orchestrator components.** A component that is just 15–50 lines of imports + rendering children is FORBIDDEN. If your component file is mostly `import` statements and a `return` with `<ChildA /><ChildB /><ChildC />`, you have failed. The JSX content belongs INLINE in the parent component. Only extract sub-components when the parent exceeds 400 lines AND each extracted piece is 150+ lines of substantial code.

## Best Practices

1. **🔴 Barrel exports are MANDATORY** — every folder containing components MUST have an `index.ts` that re-exports all public components. This includes `components/`, route `components/` folders, and component subfolders. When you create or move a component, update the barrel file. Never skip this step.
2. **One file = one component `const`** — never define private/helper JSX components in the same file. No wrappers, no section components, no exceptions. Non-JSX consts (Zod schemas, static data arrays, types, interfaces) are fine. **The solution is NOT to extract every section into its own file** — that creates over-split tiny files. Instead, inline the JSX directly in the parent component's return. Sections of a component are just JSX blocks inside the parent, not separate components. Only extract to a separate file when the parent exceeds 400 lines AND the extracted piece would be 150+ lines.

3. **PascalCase for component files** — `EmptyState.tsx`, `SearchBar.tsx`, `TopNav.tsx`
4. **Route pages use `.page.tsx` suffix** — any file that represents its own URL route gets the `.page.tsx` suffix: `Landing.page.tsx`, `Dashboard.page.tsx`, `Settings.page.tsx`. Sub-page content that doesn't have its own route (e.g., tab panels, showcase sections) stays as regular `.tsx`. Route folders use lowercase: `admin/`, `examples/`
5. **camelCase for non-component partitions** — `useAuthForm.ts`, `authForm.schema.ts` (note: PascalCase prefix matches the component name)
6. **Co-located hooks are different from shared hooks** — extracted component hooks live NEXT to their component (inside the component's folder if it has one); shared data-fetching hooks live in `hooks/`
7. **Co-location is universal — not just for components** — the same co-location and splitting rules apply to route pages, not only components in the atomic design system. A route page like `Landing.page.tsx` can have `useLanding.ts`, `landing.data.ts`, `Landing.schema.ts`, etc. next to it in the same route folder. If a page grows complex enough to need splitting, it gets its own kebab-case subfolder just like a component would. Example:
   ```
   routes/guest/landing/
   ├── Landing.page.tsx          # The route page
   ├── useLanding.ts             # Extracted page logic
   ├── landing.data.ts           # Static data / config
   ├── Landing.schema.ts         # Zod schemas for the page
   └── components/               # Page-scoped components
       └── HeroSection.tsx
   ```
8. **Don't over-split** — the goal is ~300 lines per file, NOT the maximum number of tiny files. A clean 300–400 line component is fine as-is. Never create a sub-component under ~150 lines unless it's genuinely reusable or represents a distinct domain concern.
9. **Folder structure for split components** — when a component needs splitting, create a kebab-case folder (`ComponentShowcase.tsx` → `component-showcase/`). The main file goes INSIDE the folder. Sub-components go in a `components/` subfolder within it. Small components that don't need splitting stay as single files without a folder.
10. **Max 5 props, no prop drilling** — a component must accept **no more than 5 props**. If you need more, the architecture is wrong — either the receiving component should own the logic itself (via its own hook or store), or shared state should live in a Zustand store. Props are for configuration and reusability (1 level parent→child), not for piping data. The hard rules:
    - **Never exceed 5 props** on any component. If you hit 6+, refactor: move logic into the component's own hook, or introduce a store.
    - **Never pass a prop through 2+ component levels** — use a Zustand store instead.
    - **If a child needs data the parent also uses**, create a shared Zustand store rather than passing it as a prop.
    - When planning a feature, assess upfront whether shared state is likely — if so, start with a store from day one. If you start with props and drilling or prop bloat emerges later, refactor to a store immediately.
11. **Sub-components never sit next to parent** — when a component has a folder (e.g., `component-showcase/`), extracted child components go in `component-showcase/components/ChildName.tsx`, never directly as `component-showcase/ChildName.tsx`
12. **Named exports only, no `export default`** — always `export const ComponentName = () => { ... }`. Never `const ComponentName = () => {}; export default ComponentName;`. This applies to all components, hooks, and utilities.
13. **Use `@/` alias for imports** — always prefer `@/components/...`, `@/hooks/...`, `@/api/...`, `@/stores/...`, `@/lib/...` over relative paths. Relative imports (`./`, `../`) are only acceptable for siblings within the same folder (e.g., `./ComponentName.schema.ts`, `../CodeSnippet`). Never write `../../../../../api` — use `@/api` instead.
14. **Co-located Zustand stores for pages** — when a route page needs local shared state (e.g., filters, selections, UI toggles shared between the page and its child components), create a store file next to the page: `{PageName}.store.ts`. Example: `Examples.page.tsx` gets `Examples.store.ts` in the same `routes/examples/` folder. This follows the same co-location principle as hooks, schemas, and data files. These stores are scoped to the page — they are NOT global app stores (those live in `stores/`). Import page stores with relative paths (`./Examples.store`) since they are siblings.
