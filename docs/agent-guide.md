# Axolotl Agent Guide

Use this file to brief any AI coding agent before they work in the Axolotl repository. It lists the current stack, where code lives, and the safe workflows for extending the project with GraphQL Yoga.

## Agent Checklist

- Confirm dependencies with `npm i`.
- Stick to TypeScript + ESM (no CommonJS).
- Format with Prettier (`npx prettier -w`) and lint with ESLint (`npx eslint .`) before finishing.
- Run `npm test` whenever touching core logic or adapters.
- Use only the GraphQL Yoga adapter; Apollo Server support has been removed.

## Repository Map

- `packages/core` – framework runtime (`Axolotl`, helpers, type builders).
- `packages/cli` – `@aexol/axolotl` CLI used for scaffolding, builds, inspections, and AI helpers.
- `packages/config` – shared configuration, loaded by the CLI for AI commands.
- `adapters/graphql-yoga` – the only adapter in the repo; bridges Axolotl resolvers to GraphQL Yoga.
- `examples/yoga-federated` – canonical example for running Axolotl with Yoga and module composition.
- `deno/` – Deno-compatible output and samples (still active).
- `docs/` – Next.js documentation site (this file lives here).

> Removed areas: the legacy Apollo Server adapter and the entire `modularium/` workspace were deleted. If an older guide references them, treat those steps as obsolete.

### Tooling Standards

- TypeScript strict mode, ESM, Node 18+.
- Formatting: Prettier (2 spaces, single quotes, trailing commas).
- Testing: Node’s `node:test`, colocated `*.test.ts`.
- Build all workspaces: `npm run build --ws --if-present`.
- Never run `npm run sync` unless you intend to auto-commit and push (CI will not do this for you).

## Axolotl CLI Reference (`packages/cli`)

Install locally with `npm i -g @aexol/axolotl` or use `npx`.

- `axolotl create-yoga <dir>` – scaffold a GraphQL Yoga starter.
- `axolotl build [--cwd <dir>]` – generate type-safe models from `schema.graphql`.
- `axolotl inspect -s schema.graphql -r path/to/resolvers` – catch resolver/schema mismatches.
- `axolotl chaos -s schema.graphql -u http://localhost:4000/graphql` – fuzz an endpoint.
- `axolotl ai ...` / `frontend-ai` / `graphql-ai` – prompt-based codegen; expects env vars (e.g., `OPENAI_API_KEY`) read via `@aexol/axolotl-config`.
- `axolotl mcp schema.graphql --endpoint http://localhost:4000/graphql` – run the GraphQL MCP server for tooling integrations.
- `axolotl create-dockerfile` – scaffold Dockerfile for deployment.

**Developing the CLI**

- Build: `npm run build --ws --if-present`.
- Tests: `npm test`.
- Lint scoped to CLI: `npx eslint packages/cli`.
- Starter templates live in `packages/cli/create/templates/`; keep READMEs and schema/resolver examples aligned.

## Working With GraphQL Yoga

- Adapter entrypoint: `adapters/graphql-yoga/index.ts`.
- Create resolvers:
  ```ts
  import { Axolotl } from '@aexol/axolotl-core';
  import { graphqlYogaAdapter } from '@aexol/axolotl-graphql-yoga';

  const { createResolvers } = Axolotl(graphqlYogaAdapter)<{
    Query: { hello: string };
  }>();

  const resolvers = createResolvers({
    Query: { hello: () => 'world' },
  });
  ```
- Start server:
  ```ts
  const { server } = graphqlYogaAdapter({ resolvers }).adapter({ resolvers });
  server.listen(4000);
  ```
- To extend context types use `graphqlYogaWithContextAdapter<Ctx>()` and provide a per-request `context` factory.
- Scalars/directives come from `createScalars` / `createDirectives` in `@aexol/axolotl-core`.
- See `examples/yoga-federated/src/server.ts` for the full pipeline (schema, models, resolvers, server).

## Quickstart: New Axolotl + Yoga Project

```sh
git clone https://github.com/aexol-studio/axolotl.git my-axolotl-app
cd my-axolotl-app
npm i
npx @aexol/axolotl create-yoga apps/my-yoga-server
npx @aexol/axolotl build --cwd apps/my-yoga-server
npm -w apps/my-yoga-server run dev
```

Adjust the root `package.json` `workspaces` array if you add new folders under `apps/`.

## Common Pitfalls

- Forgetting to rerun `axolotl build` after schema edits causes stale TS types.
- Missing `.ts` file extensions in ESM imports breaks runtime resolution.
- AI commands fail silently if `@aexol/axolotl-config` can’t find required credentials; check environment variables first.
- Examples assume port `4000`; free it before running `npm -w examples/yoga-federated run dev`.

## Sharing This With Agents

- Always point assistants to `docs/agent-guide.md` before tasks.
- The root `Readme.md` links to this file so npm readers can discover it.
- Add package-level “Agent Notes” in individual READMEs if a workspace has unique steps.

Keep this guide current whenever you modify the CLI, Yoga adapter, or project layout. Clear instructions up front save cycles with every future agent.
