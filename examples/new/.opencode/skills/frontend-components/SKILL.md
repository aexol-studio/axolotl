---
name: frontend-components
description: Frontend component architecture - atomic design, file splitting (~300 line target, hard max 400 lines), reusability principles, route-scoped components, and co-located partitions
---

## Atomic Design Placement

- **atoms/** — smallest reusable UI, no custom component children (e.g. `EmptyState`, `StatusBadge`)
- **molecules/** — reusable compositions of atoms, single responsibility (e.g. `SearchBar`, `ConfirmDialog`)
- **organisms/** — large reusable sections composing multiple molecules/atoms (e.g. `DataTable`, `Sidebar`)
- **global/** — app-wide: layouts, providers, nav, footer
- **ui/** — shadcn/ui primitives — DO NOT move or edit
- Components specific to a single route go in `routes/{route}/components/` — **not** in the atomic system regardless of size

## File Splitting

- **Target:** ~300 lines per file. **Hard max:** 400 lines — split immediately when reached.
- **Minimum sub-component size:** 150 lines — never extract smaller pieces.
- **Split priority (mandatory order):** hook → data → schema → types → sub-components (last resort only, after steps 1–4 are exhausted)

| Partition          | File name                                                |
| ------------------ | -------------------------------------------------------- |
| Logic hook         | `{Name}.hook.ts` — exports ONE hook, returns flat object |
| Static/config data | `{Name}.data.ts`                                         |
| Zod/RHF schemas    | `{Name}.schema.ts`                                       |
| TypeScript types   | `{Name}.types.ts`                                        |
| Sub-components     | `{name}/components/Child.tsx`                            |

## Folder Rule

When a component has **any** co-located partition (hook, schema, data, types), it moves into a kebab-case folder with a barrel `index.ts`. The main `.tsx` lives inside the folder. Sub-components go in a `components/` subfolder — never directly beside the parent.

## Route-Scoped Components

- Single-route components live in `routes/{group}/{route}/components/`
- **Promote when shared:** if used by 2+ routes → move to `components/atoms|molecules|organisms/`, add props, export from barrel
- **Recursive nesting:** route-scoped sub-components follow the same folder rule — if a sub-component needs a hook/schema/data partition, it gets its own kebab-case folder with barrel `index.ts` inside the parent's `components/` dir

## Key Rules

- **Reusability-first:** a genuinely generic component (works with any data on any page) belongs in atomic design from day one — even if only one route uses it today
- **One hook per file:** `.hook.ts` exports a single hook consolidating all data fetching, mutations, state, and handlers for that view
- **No `export default`** — always named exports
- **Max 5 props** — if 6+, move logic into the component's own hook or a Zustand store; never prop-drill through 2+ levels
- **Barrel exports are mandatory** — every folder containing components must have an `index.ts`
- **No private named sub-components — ever.** Do NOT define helper components like `const Row = () => <li>...</li>` or `const TodoItem = ...` inside a `.tsx` file alongside the exported component. There is NO exception to this rule, regardless of file size. "Inline them instead" means: delete the named component entirely and write its JSX directly inside the parent's render — no extraction to separate files, no private const, just flat JSX. If the JSX repetition is too large to inline (file would exceed 400 lines), ONLY THEN extract to a separate file in `components/`. Never create a named component in the same file as another exported component.
- **No thin orchestrator components** — a component whose entire body is just `<ChildA /><ChildB />` with no logic is forbidden. Merge its JSX into the real parent.
- **`@/` alias for imports** — use `@/components/...`, `@/hooks/...` etc.; relative paths only for siblings in the same folder
- **PascalCase for component files** — `EmptyState.tsx`, `SearchBar.tsx`, `TopNav.tsx`. Partitions use PascalCase prefix: `AuthForm.hook.ts`, `AuthForm.schema.ts`, `AuthForm.data.ts`
- **Co-location applies to route pages** — `Landing.page.tsx` can have `Landing.hook.ts`, `Landing.data.ts`, `Landing.schema.ts` beside it in the same folder
