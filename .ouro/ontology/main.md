# Ouro Ontology

## Technologies

- @aexol/axolotl
- @aexol/axolotl-config
- @aexol/axolotl-core
- @aexol/axolotl-graphql-yoga
- @graphql-tools/utils
- @modelcontextprotocol/sdk
- autoprefixer
- chalk
- chokidar
- clipboardy
- commander
- config-maker
- ESLint
- glob
- globals
- GraphQL
- GraphQL Yoga
- GraphQL Zeus (generated client)
- graphql-js-tree
- Jest
- jiti
- Next.js
- nextra
- nextra-theme-docs
- node-fetch
- nodemon
- node:test
- node:assert
- openai
- ora
- Playwright
- postcss
- Prettier
- React
- sass
- tailwindcss
- ts-node
- ts-patch
- tsx
- TypeScript
- typescript-transform-paths
- wrangler
- ws
- npm workspaces
- ECMAScript Modules (ESM)

## Overview

Axolotl is organized as a workspace-enabled npm monorepo and ships as ESM. The top-level package.json defines workspaces for packages/*, adapters/graphql-yoga, and examples/yoga-federated. Repo-wide scripts (build/test/sync) live at the root and orchestrate individual packages.

- Core runtime and codegen primitives live in packages/core with TypeScript sources at the package root and compiled outputs in lib/.
- Configuration helpers live in packages/config and are consumed by the CLI to persist schema/model paths.
- The CLI (packages/cli) exposes the axolotl command via Commander, delegating to @aexol/axolotl-core and config.
- Adapters implement concrete server bindings (e.g., GraphQL Yoga) under adapters/*.
- Examples (e.g., examples/yoga-federated) demonstrate usage end-to-end, including schema, resolvers, and server bootstrapping.
- Documentation is a Next.js site under docs/.

GraphQL stack:
- Core builds on the graphql reference implementation for schema/runtime, and uses @graphql-tools/utils and graphql-js-tree for schema introspection and transformations.
- The GraphQL Yoga adapter and example server use graphql-yoga; the adapter hydrates the schema, applies directives/scalars, builds per-request context, and exposes a Node http server.
- Core provides a resolver factory via Axolotl(adapter)<Models>() that returns typed helpers (e.g., createResolvers) bound to the active adapter, and federation helpers (e.g., mergeAxolotls) to compose module resolver maps.
- Adapter contract: the AxolotlAdapter generic factory is declared in packages/core/index.ts:13; adapters implement it to translate Axolotl resolvers/directives/scalars into a concrete server runtime.

Data modeling and types:
- Schema-first: the primary domain objects are defined in the GraphQL SDL. The Yoga federated example declares types such as Todo, TodoOps, User, the AuthorizedUser* variants, and the Query/Mutation roots in examples/yoga-federated/schema.graphql:1-55.
- Codegen: the core generator (packages/core/gen.ts) parses SDL and emits strongly typed Models, Scalars, interfaces, and enums. The example runs npm -w examples/yoga-federated run models to generate examples/yoga-federated/src/models.ts:1-113.
- Per-slice models: each feature module (e.g., todos, users) maintains its own generated Models and TypeScript interfaces under examples/yoga-federated/src/**/models.ts to keep resolver typing localized.
- Client types: a generated Zeus client lives under examples/yoga-federated/src/zeus/* and provides a strongly typed query builder powered by fetch/WebSocket; no ORM or DB client is involved.

Tooling and runtime helpers:
- CLI UX and orchestration leverage commander, chalk, ora, chokidar, clipboardy, and integrate AI-assisted features via openai and @modelcontextprotocol/sdk.
- TypeScript toolchain relies on typescript, tsx, ts-patch, eslint, and prettier.
- Testing uses Node’s built-in node:test runner with node:assert (see root package.json test script and packages/core/gen.test.ts).
- node-fetch and ws provide HTTP and WebSocket interactions used across core/engine and examples.

Testing scope:
- Automated tests currently cover only resolveFieldType in the core generator (packages/core/gen.test.ts), ensuring emitted TypeScript wrapper types match nested GraphQL field shapes.
- Jest configuration files exist in several packages (e.g., packages/core/jest.config.js and matching files under packages/cli and packages/config), but there are no corresponding .spec.* files; Jest is presently unused.

Entry points:
- Library: packages/core/index.ts
- Federation helpers: packages/core/federation.ts
- Code generator: packages/core/gen.ts
- CLI binary: packages/cli/index.ts
- Adapter factory (Yoga): adapters/graphql-yoga/index.ts exports graphqlYogaWithContextAdapter and the ready-to-use graphqlYogaAdapter
- Example server boot: examples/yoga-federated/src/index.ts

## Communication

- GraphQL wiring: Feature modules register their handlers by calling Axolotl(graphqlYogaAdapter)<Models>(), which returns typed helpers like createResolvers tied to the active adapter (packages/core/index.ts; examples/yoga-federated/src/axolotl.ts). The default graphqlYogaAdapter is the preconfigured instance produced by graphqlYogaWithContextAdapter({}).
- Resolver contract: Every resolver receives a tuple [source, args, context] supplied by the adapter. Modules communicate strictly through GraphQL field resolution and the Yoga context—there is no custom RPC or HTTP routing layer involved (adapters/graphql-yoga/index.ts; examples/yoga-federated/src/todos/resolvers.ts; examples/yoga-federated/src/users/resolvers.ts).
- Federation/merging: Modules are stitched together with mergeAxolotls, which fuses multiple resolver maps into a single schema-aware super graph so sub‑modules interoperate without manual wiring (packages/core/federation.ts; examples/yoga-federated/src/resolvers.ts).
- Transport/runtime: HTTP serving and schema loading are handled entirely by the GraphQL Yoga adapter. It hydrates the schema, injects directives/scalars (via @graphql-tools/utils), builds per-request context, and exposes a Node http server (adapters/graphql-yoga/index.ts; examples/yoga-federated/src/index.ts).
- Error propagation: Resolver throws are passed through the adapter to GraphQL Yoga for standard error formatting; clients receive HTTP rejections or GraphQL errors per the generated Zeus client behavior (adapters/graphql-yoga/index.ts; examples/yoga-federated/src/zeus/index.ts).
- Intra-repo package dependencies: CLI and adapters depend on @aexol/axolotl-core; CLI also depends on @aexol/axolotl-config.
- Core relies on the graphql reference implementation, with @graphql-tools/utils and graphql-js-tree assisting schema inspection and transformations.
- CLI composes commander-based routing with chalk/ora for UX, chokidar for file watching, clipboardy for clipboard ops, and integrates AI via openai and @modelcontextprotocol/sdk.
- Runtime helpers node-fetch and ws enable HTTP/WebSocket interactions used by core workflows and example servers.
- Examples consume published package APIs (core, adapters) and generated models to compose schemas/resolvers and start servers.
- Workspace maintenance scripts operate across workspaces to sync versions and build outputs.
- Data access: resolvers in the examples use lightweight in-memory stores (arrays) defined per module (e.g., examples/yoga-federated/src/todos/db.ts, examples/yoga-federated/src/users/db.ts); there is no ORM or external database driver configured.
- Client consumption: an optional generated Zeus client (examples/yoga-federated/src/zeus) can query/subscribe against the Yoga server using fetch/WebSocket; it shares the same schema-derived types.

## Patterns

- Monorepo with npm workspaces for modular packages (core, config, cli, adapters, examples, docs).
- Adapter pattern (AxolotlAdapter) to target different server runtimes (e.g., GraphQL Yoga). The AxolotlAdapter generic factory is declared in packages/core/index.ts:13 and captures adapter input/directive types; adapter implementations receive { resolvers, directives, scalars } plus optional options and return a concrete runtime.
- GraphQL-first inter-module communication: modules interact via GraphQL resolvers receiving [source, args, context] from the active adapter; no bespoke REST routing or RPC layer.
- Schema-first code generation: SDL drives typed Models/Scalars and resolver signatures; Axolotl(adapter)<Models>() enforces type-safe handlers derived from generated models.
- Federation via mergeAxolotls to compose multiple module resolver maps into a schema-aware super graph.
- CLI orchestration pattern using Commander to invoke core helpers and configuration, with UX utilities (chalk, ora) and file watching (chokidar).
- Code generation utilities centralized in core; tests are colocated with sources.
- Testing approach: Node’s built-in node:test with node:assert; Jest configs are present but dormant due to lack of .spec.* files.
- Coverage status: automated tests currently validate only resolveFieldType in the core generator.
- Layered composition in examples: feature slices (schema/resolvers/data) merged into federated execution.
- ESM-first packaging; TS sources compiled to lib/ per package.
- AI-assisted CLI features via OpenAI and Model Context Protocol SDK.
- Middleware support via core helpers (e.g., applyMiddleware) for cross-cutting concerns on specific resolvers.
- In-memory repository pattern in examples for data access; persistence is pluggable by swapping db modules for real repositories without changing generated types.
- Error handling:
  - Core generator and federation tooling throw plain Error on invariant violations; no custom error types or result wrappers (packages/core/gen.ts; packages/core/federation.ts). Callers are expected to catch/format failures.
  - CLI contains failures at the command boundary using success | { error } results; createAppAction logs a formatted failure banner and exits with code 1, runCommands catches unexpected exceptions and returns a message payload, and runCommand swallows failures, emits context with chalk, and returns false (packages/cli/create/utils.ts).
  - Chaos testing never throws outward; each request is wrapped in try/catch and errors are coerced into structured entries for end-of-run reporting (packages/core/chaos.ts).
  - Adapter passes resolver errors straight through to GraphQL Yoga for framework-level formatting (adapters/graphql-yoga/index.ts).
  - Example resolvers simply throw Error strings; the generated Zeus client converts HTTP errors into rejected Promises and raises a generated GraphQLError for GraphQL-level failures while retaining the original response (examples/yoga-federated/src/zeus/index.ts).
  - There is no global error helper or shared boundary; consumers wrap calls when richer handling is required.

## Components

- Core library (packages/core)
  - Entry: packages/core/index.ts (exports Axolotl factory, middleware helpers, codegen utilities).
  - Resolver factory: Axolotl(adapter)<Models>() returns typed helpers such as createResolvers bound to the active adapter/context; resolver and handler generics are defined in packages/core/index.ts and packages/core/types.ts.
  - Adapter contract: AxolotlAdapter is declared as a generic factory in packages/core/index.ts:13. It captures adapter input/directive types and produces a function that accepts { resolvers, directives, scalars } plus optional options to build the concrete runtime.
  - Federation: packages/core/federation.ts exports mergeAxolotls to fuse multiple resolver maps; leverages graphql-js-tree to merge/compose SDL in federation scenarios.
  - Code generation: packages/core/gen.ts parses GraphQL SDL and emits strongly typed Models, Scalars, interfaces, and enums that drive resolver signatures and client typings.
  - Structure: hand-written TypeScript at package root (e.g., types.ts, gen.ts, chaos.ts) with compiled JS in lib/.
  - GraphQL foundations: builds on graphql; uses @graphql-tools/utils and graphql-js-tree for introspection/transformations.
  - Runtime helpers: can leverage node-fetch and ws where HTTP/WebSocket interactions are required.
  - Error handling: gen.ts and federation.ts throw plain Error on invariant violations; chaos.ts wraps per-request operations in try/catch, coercing decode/transport failures into structured report entries without throwing outward.
  - Testing: runs with Node’s node:test and node:assert (root npm test script). Current automated coverage is limited to resolveFieldType in packages/core/gen.test.ts.
  - Testing configs: a Jest config file exists (packages/core/jest.config.js), but there are no Jest test files; Jest is not used.

- Configuration package (packages/config)
  - Entry: packages/config/index.ts.
  - Role: wraps persistent project settings used by the CLI (e.g., schema/model paths).
  - Internals: uses config-maker to centralize shared config/build defaults.
  - Testing configs: Jest config present, but no matching Jest tests.

- CLI (packages/cli)
  - Entry/bin: packages/cli/index.ts (Commander-based axolotl command).
  - Commands: build, federation, codegen, inspection.
  - Internals: orchestrates @aexol/axolotl-core helpers and config; additional command modules under packages/cli/create and packages/cli/codegen.
  - Tooling: commander for routing; chalk and ora for terminal UX; chokidar for watching; clipboardy for clipboard operations; integrates AI features via openai and @modelcontextprotocol/sdk.
  - Error handling: commands return success | { error } results rather than throwing; createAppAction logs a failure banner and process.exit(1) on error, runCommands catches unexpected exceptions and returns a message payload, and runCommand swallows failures, emits context, and returns false (packages/cli/create/utils.ts).
  - Example codegen workflow: npm -w examples/yoga-federated run models invokes the core generator to emit typed models from the example SDL.
  - Testing configs: Jest config present, but no matching Jest tests.

- Automation scripts (packages/scripts)
  - Source: packages/scripts/src.
  - Example: npm run sync calls packages/scripts/src/packages.ts for workspace maintenance.

- Adapters
  - GraphQL Yoga (adapters/graphql-yoga)
    - Package: @aexol/axolotl-graphql-yoga
    - Exports:
      - graphqlYogaWithContextAdapter: a configurable factory that calls AxolotlAdapter<[any, any, Context], SchemaMapper>() and returns the adapter implementation. It maps resolvers to Yoga, builds the schema, wires directives/scalars, and returns a runtime object (e.g., { server, yoga }).
      - graphqlYogaAdapter: the ready-to-use instance produced by graphqlYogaWithContextAdapter({}), exposing an AxolotlAdapter-compatible adapter with default context wiring.
    - Role: implements the AxolotlAdapter pattern and powers the Yoga HTTP server (graphql-yoga).
    - Responsibilities: hydrates schema, applies directives/scalars (via @graphql-tools/utils), builds per-request context, and exposes a Node http server; supplies resolvers with the [source, args, context] tuple.
    - Error handling: resolver errors are passed through to Yoga, which performs standard GraphQL error formatting; the adapter does not introduce custom error boundaries.

- Examples
  - examples/yoga-federated
    - Schema: examples/yoga-federated/schema.graphql defines Todo, TodoOps, User, AuthorizedUser*, Query, and Mutation roots (lines 1–55).
    - Composition: src/axolotl.ts composes the Yoga adapter with generated models via Axolotl(graphqlYogaAdapter)<Models>() to produce typed resolver helpers (e.g., createResolvers).
    - Features: feature slices (todos, users) each with schema, resolvers, and local data modules; resolver files consume the [source, args, context] tuple from the adapter.
    - Data access: lightweight in-memory stores per module (e.g., src/todos/db.ts, src/users/db.ts) back the resolvers; arrays of TodoModel/UserModel are filtered/inserted/mutated—no ORM.
    - Models: generated models at src/models.ts drive example-wide typings; each slice also keeps its own generated models under src/**/models.ts for localized resolver typing.
    - Client: a generated Zeus client under src/zeus (index.ts, const.ts) provides typed query/subscription builders using fetch/WebSocket; host configuration is expected at usage time.
    - Error handling: server-side samples throw Error strings; the generated Zeus client converts HTTP errors into rejected Promises and raises a generated GraphQLError for GraphQL-layer failures, retaining the original response for inspection (examples/yoga-federated/src/zeus/index.ts).
    - Aggregation: src/resolvers.ts merges feature resolver maps with mergeAxolotls for federated execution.
    - Entry: src/index.ts boots the HTTP server through the Yoga adapter.

- Docs
  - docs/ is a Next.js site with docs/pages and docs/theme.config.tsx.

- Assets/metadata
  - Root-level files (e.g., AGENTS.md, Thoughts.md, modularium.png).
  - Build artifacts: compiled lib/ directories under each package.

Technologies (for reference): @aexol/axolotl, @aexol/axolotl-config, @aexol/axolotl-core, @aexol/axolotl-graphql-yoga, @graphql-tools/utils, @modelcontextprotocol/sdk, autoprefixer, chalk, chokidar, clipboardy, commander, config-maker, ESLint, glob, globals, GraphQL, GraphQL Yoga, GraphQL Zeus (generated client), graphql-js-tree, Jest, jiti, Next.js, nextra, nextra-theme-docs, node-fetch, nodemon, openai, ora, Playwright, postcss, Prettier, React, sass, tailwindcss, ts-node, ts-patch, tsx, TypeScript, typescript-transform-paths, wrangler, ws

Technologies (for reference): @aexol/axolotl, @aexol/axolotl-config, @aexol/axolotl-core, @modelcontextprotocol/sdk, autoprefixer, chalk, chokidar, clipboardy, commander, config-maker, ESLint, glob, globals, GraphQL, GraphQL Yoga, Jest, jiti, Next.js, nextra, nextra-theme-docs, node-fetch, nodemon, openai, ora, Playwright, postcss, Prettier, React, sass, tailwindcss, ts-node, ts-patch, tsx, TypeScript, typescript-transform-paths, wrangler, ws

Technologies (for reference): @aexol/axolotl, @aexol/axolotl-config, @aexol/axolotl-core, @modelcontextprotocol/sdk, autoprefixer, chalk, chokidar, clipboardy, commander, config-maker, ESLint, glob, globals, GraphQL, GraphQL Yoga, Jest, jiti, Next.js, nextra, nextra-theme-docs, node-fetch, nodemon, openai, ora, Playwright, postcss, Prettier, React, sass, tailwindcss, ts-node, ts-patch, tsx, TypeScript, typescript-transform-paths, wrangler, ws

Technologies (for reference): @aexol/axolotl, @aexol/axolotl-config, @aexol/axolotl-core, @modelcontextprotocol/sdk, autoprefixer, chalk, chokidar, clipboardy, commander, config-maker, ESLint, glob, globals, GraphQL, GraphQL Yoga, Jest, jiti, Next.js, nextra, nextra-theme-docs, node-fetch, nodemon, openai, ora, Playwright, postcss, Prettier, React, sass, tailwindcss, ts-node, ts-patch, tsx, TypeScript, typescript-transform-paths, wrangler, ws