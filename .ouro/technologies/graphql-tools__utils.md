# @graphql-tools/utils — README (from repo)

# @graphql-tools/utils

A lean, battle‑tested toolbox for building, transforming, and operating GraphQL schemas and operations. It powers most of GraphQL Tools’ higher‑level features and is designed to be used directly in your apps and libraries.

- Transform and rewrite schemas safely (mapSchema, MapperKind)
- Read and apply directives (getDirective, getDirectiveExtensions)
- Filter/prune/print schemas (filterSchema, pruneSchema, getDocumentNodeFromSchema)
- Work with async iterables and cancellation (mapAsyncIterator, withCancel, getAbortPromise)
- Merge and compose configuration/state (mergeDeep and helpers)
- Types and helpers for execution (Executor, ExecutionRequest, createGraphQLError)

Links to full API: https://www.graphql-tools.com/docs/api/modules/utils_src


## Installation

```bash
npm install @graphql-tools/utils
# or
yarn add @graphql-tools/utils
```

Requires Node.js >= 16.


## Quick Start

Implement a schema directive by rewriting the schema at build time:

```ts
import { GraphQLSchema, defaultFieldResolver } from 'graphql'
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils'

export function upperDirective(directiveName: string) {
  return (schema: GraphQLSchema) =>
    mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const dir = getDirective(schema, fieldConfig, directiveName)?.[0]
        if (!dir) return
        const { resolve = defaultFieldResolver } = fieldConfig
        return {
          ...fieldConfig,
          async resolve(src, args, ctx, info) {
            const out = await resolve(src, args, ctx, info)
            return typeof out === 'string' ? out.toUpperCase() : out
          }
        }
      }
    })
}
```

Use it with your schema:

```ts
import { makeExecutableSchema } from '@graphql-tools/schema'
import { upperDirective } from './upper'

let schema = makeExecutableSchema({
  typeDefs: /* GraphQL */ `
    directive @upper on FIELD_DEFINITION
    type Query { hello: String @upper }
  `,
  resolvers: { Query: { hello: () => 'hello world' } }
})

schema = upperDirective('upper')(schema)
```


## Key Features

- Schema mapping and rewiring
  - mapSchema(schema, mapper) to walk and rewrite types, fields, args, enum values, and directives
  - MapperKind.* constants to target exactly what you want
- Directive helpers
  - getDirective(schema, node, name) reads directive usage with arguments from SDL
  - getDirectiveExtensions(schema, node) surfaces directive metadata from extensions
- Prune, filter, and print
  - filterSchema(...) to include/exclude types, fields, args, enum values, and directives
  - pruneSchema(schema) to remove unreachable/empty types (run after filtering)
  - getDocumentNodeFromSchema(schema) to generate a printable DocumentNode
- Async iterable utilities
  - mapAsyncIterator(asyncIterable, map, onError?, onEnd?): transform streams safely
  - withCancel(asyncIterable, onCancel): cancel underlying sources
  - getAbortPromise(signal), registerAbortSignalListener(signal, onAbort)
- Deep merge and small utilities
  - mergeDeep(sources[, options]) for predictable deep merges
  - isUrl, inspect, Path helpers, etc.
- Execution types and helpers
  - ExecutionRequest shape (with operationType, variables, extensions, subgraphName, etc.)
  - createGraphQLError for consistent error construction across GraphQL versions


## Configuration

This package does not require global configuration. Most helpers are pure functions with optional parameters:

- getDirective(schema, node, name, pathToDirectivesInExtensions?)
  - For code‑first schemas, pass a custom path to directive metadata within extensions (default: ['directives']).
- filterSchema({ schema, typeFilter?, fieldFilter?, rootFieldFilter?, argFilter?, enumValueFilter?, directiveFilter? })
- pruneSchema(schema, options?)
- mergeDeep(sources, { respectArrayLength?, respectProto? }?)

See API docs for full signatures: https://www.graphql-tools.com/docs/api/modules/utils_src


## Common Pitfalls

- Always return the new config/type from mapSchema when you modify it. If you return undefined, the original is kept; return null to remove.
- After filterSchema, run pruneSchema to remove now‑unreachable types (e.g., empty interfaces, orphan enums).
- When implementing directives for code‑first schemas, ensure directive metadata exists under schema/type/field extensions. Use getDirective(..., pathToDirectivesInExtensions) if your path differs from the default.
- mergeDeep merges arrays by concatenation by default; enable respectArrayLength to merge element‑by‑element when arrays share length.
- mapAsyncIterator’s onError and onEnd are guaranteed to run once. Don’t rely on multiple invocations.
- Use getAbortPromise/registerAbortSignalListener instead of manually adding many abort listeners to avoid Node.js MaxListeners warnings.


## Examples

### 1) Build a “rename” schema directive

```ts
import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils'

export function renameDirective(directiveName: string) {
  return (schema: GraphQLSchema) =>
    mapSchema(schema, {
      [MapperKind.OBJECT_TYPE]: (type) => {
        const dir = getDirective(schema, type, directiveName)?.[0]
        if (!dir) return
        const { to } = dir
        const config = type.toConfig()
        return new GraphQLObjectType({ ...config, name: to })
      },
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const dir = getDirective(schema, fieldConfig, directiveName)?.[0]
        if (!dir) return
        const { to } = dir
        // Returning [newName, config] renames a field
        return [to, fieldConfig]
      }
    })
}
```

Usage in SDL:

```graphql
directive @rename(to: String!) on OBJECT | FIELD_DEFINITION

type Person @rename(to: "Human") {
  currentDateMinusDateOfBirth: Int @rename(to: "age")
}
```


### 2) Enforce access control with an auth directive

```ts
import { defaultFieldResolver } from 'graphql'
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils'

export function authDirective(directiveName: string, hasRole: (ctx: any, role: string) => boolean) {
  return (schema) =>
    mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
        const dir = getDirective(schema, fieldConfig, directiveName)?.[0]
        if (!dir) return
        const { requires } = dir
        const { resolve = defaultFieldResolver } = fieldConfig
        return {
          ...fieldConfig,
          async resolve(src, args, ctx, info) {
            if (!hasRole(ctx, requires)) throw new Error('not authorized')
            return resolve(src, args, ctx, info)
          }
        }
      }
    })
}
```

SDL:

```graphql
directive @auth(requires: String = "ADMIN") on FIELD_DEFINITION
```


### 3) Filter a schema for public fields only

```ts
import { filterSchema, pruneSchema } from '@graphql-tools/utils'

const publicSchema = pruneSchema(
  filterSchema({
    schema,
    fieldFilter: (typeName, fieldName) => !fieldName.startsWith('_'),
    directiveFilter: (directive) => directive.name !== 'internal'
  })
)
```


### 4) Print a DocumentNode from a schema

```ts
import { getDocumentNodeFromSchema } from '@graphql-tools/utils'
import { print } from 'graphql'
import { writeFileSync } from 'node:fs'

const doc = getDocumentNodeFromSchema(schema)
writeFileSync('schema.graphql', print(doc))
```


### 5) Stream transformation with cancellation

```ts
import { mapAsyncIterator, getAbortPromise } from '@graphql-tools/utils'

async function* source() {
  yield 1; yield 2; yield 3
}

const controller = new AbortController()
const mapped = mapAsyncIterator(source(), (n) => n * 10, (err) => console.error(err), () => console.log('done'))

// Cancel after first value
;(async () => {
  for await (const v of mapped) {
    console.log(v)
    controller.abort()
  }
})()

await getAbortPromise(controller.signal).catch(() => {/* aborted */})
```


### 6) Merge deeply with array control

```ts
import { mergeDeep } from '@graphql-tools/utils'

const a = { headers: { accept: ['a', 'b'] } }
const b = { headers: { accept: ['c'] } }

mergeDeep([a, b])                     // { headers: { accept: ['a','b','c'] } }
mergeDeep([a, b], { respectArrayLength: true }) // { headers: { accept: ['c','b'] } }
```


## Frequently Used APIs (at a glance)

- mapSchema(schema, mapper) and MapperKind.*
- getDirective(schema, node, name, pathToDirectivesInExtensions?)
- getDirectiveExtensions(schema, node)
- filterSchema(options), pruneSchema(schema)
- getDocumentNodeFromSchema(schema)
- mapAsyncIterator(asyncIterable, transform, onError?, onEnd?)
- withCancel(asyncIterable, onCancel)
- getAbortPromise(signal), registerAbortSignalListener(signal, onAbort)
- mergeDeep(sources, options)
- createGraphQLError(messageOrOptions)


## When to Use @graphql-tools/utils

- You need precise control over a GraphQLSchema: renaming, removing, or wrapping types and fields.
- You implement custom schema directives (code‑first or SDL‑first).
- You want to ship plugins/transforms that modify schemas safely.
- You need robust async iterator utilities for subscriptions, live queries, defer/stream, etc.
- You need to filter/prune/serialize schemas for publishing, printing, or client artifacts.


## Related Packages

- @graphql-tools/schema — build/compose executable schemas
- @graphql-tools/merge — merge typeDefs/resolvers
- @graphql-tools/mock — mock schemas and data
- @graphql-tools/load / load-files — load schemas & documents
- @graphql-tools/url-loader — build executable schemas from HTTP endpoints

Full docs: https://www.graphql-tools.com/docs/introduction


## Links

- Docs index: https://www.graphql-tools.com/docs/introduction
- API (@graphql-tools/utils): https://www.graphql-tools.com/docs/api/modules/utils_src
- Repo: https://github.com/ardatan/graphql-tools/tree/master/packages/utils
- Issues: https://github.com/ardatan/graphql-tools/issues
- Discussions/Support (The Guild): https://the-guild.dev


## Changelog Highlights

- mapAsyncIterator invokes onError/onEnd only once; improved abort helpers (getAbortPromise, registerAbortSignalListener).
- getDirectiveExtensions added; directive extraction from extensions improved.
- filterSchema got enumValueFilter and directiveFilter; pruneSchema fixes for edge cases.
- mergeDeep enhancements (nullish handling, array merging).
- ExecutionRequest extended (operationType required; subgraphName supported).
- createGraphQLError introduced for GraphQL v17 compatibility.

For full history, see GitHub Releases.