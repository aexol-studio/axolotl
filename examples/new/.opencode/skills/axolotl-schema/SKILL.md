---
name: axolotl-schema
description: Schema-first development, @resolver directive, models generation, resolver boilerplate scaffolding, CLI commands, and inspect tool
---

## Rules

- Write schema in `.graphql` files → run `axolotl build` → types generated in `models.ts`
- **NEVER edit `models.ts` manually** — always overwritten by `axolotl build`
- `@resolver` marks fields requiring a resolver implementation
- Each federation module has its own `.graphql`; `axolotl build` merges them into `backend/schema.graphql`
- **No `extend type`** — Axolotl merges types by name. Use plain `type` declarations.
- Always use `.js` extensions in imports (ESM)

## `@resolver` Directive

```graphql
directive @resolver on FIELD_DEFINITION

type Query {
  user: AuthorizedUserQuery @resolver # needs resolver
  hello: String! # no @resolver — resolved inline
}
```

`axolotl resolvers` scaffolds files only for `@resolver` fields.

## CLI Commands

| Command                                                                          | Effect                                                           |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `cd backend && npx @aexol/axolotl build`                                         | Merge schemas → regenerate `models.ts` + Zeus client             |
| `cd backend && npx @aexol/axolotl resolvers`                                     | Scaffold resolver files for `@resolver` fields (non-destructive) |
| `cd backend && npx @aexol/axolotl inspect -s schema.graphql -r lib/resolvers.js` | Report unimplemented `@resolver` fields                          |

## Federation Schema Pattern

```graphql
# src/modules/users/schema.graphql
directive @resolver on FIELD_DEFINITION

type AuthorizedUserQuery {
  me: User @resolver
}
```

Declare `type` with same name across modules — `axolotl build` merges fields. `axolotl.json` lists all module schemas under `federation[]`.
