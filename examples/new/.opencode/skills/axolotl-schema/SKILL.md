---
name: axolotl-schema
description: Schema-first development, @resolver directive, models generation, resolver boilerplate scaffolding, CLI commands, and inspect tool
---

## Rules

- Write schema in `.graphql` files → run `axolotl build` → types generated in `models.ts`
- **NEVER edit `models.ts` manually** — it is always overwritten by `axolotl build`
- `@resolver` marks a field that requires a resolver implementation; declare it in every module schema that uses it
- Each federation module has its own `.graphql`; `axolotl build` merges them into `backend/schema.graphql`
- Always use `.js` extensions in imports (ESM)

## `@resolver` directive

Declare in each schema file that uses it:

```graphql
directive @resolver on FIELD_DEFINITION

type Query {
  user: AuthorizedUserQuery @resolver # gateway — needs resolver
  hello: String! # no @resolver — resolved inline
}
```

`axolotl resolvers` reads `@resolver` fields and scaffolds resolver files. Only fields with `@resolver` are scaffolded — plain fields are not.

## CLI Commands

| Command                                                                          | What it does                                                          |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `cd backend && npx @aexol/axolotl build`                                         | Merges federation schemas → regenerates `models.ts` + Zeus client     |
| `cd backend && npx @aexol/axolotl resolvers`                                     | Scaffolds resolver files for all `@resolver` fields (non-destructive) |
| `cd backend && npx @aexol/axolotl inspect -s schema.graphql -r lib/resolvers.js` | Reports unimplemented `@resolver` fields                              |

## Federation schema pattern

Each module declares its own types and the `@resolver` directive:

```graphql
# src/modules/users/schema.graphql
directive @resolver on FIELD_DEFINITION

type AuthorizedUserQuery {
  me: User @resolver
}
```

`axolotl.json` lists all module schemas under `federation[]`; `axolotl build` merges them.
