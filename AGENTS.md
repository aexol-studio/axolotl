# Repository Guidelines

## Project Structure & Module Organization
- Root is an npm workspaces monorepo. Key folders:
  - `packages/`: core library (`core`), CLI (`cli`), shared config/scripts.
  - `adapters/`: framework adapters (`graphql-yoga`, `apollo-server`).
  - `examples/`: runnable examples (e.g., `beerpub-yoga`, `yoga-federated`).
  - `modularium/`: installable GraphQL modules and playground.
  - `deno/`: Deno-compatible adapters and examples.
  - `docs/`: documentation and assets.
- Tests live alongside source (e.g., `packages/core/gen.test.ts`).

## Build, Test, and Development Commands
- Install: `npm i`
- Build all workspaces: `npm run build --ws --if-present`
- Run tests: `npm test` (Node test runner over `packages/**/*.test.*`)
- Lint: `npx eslint .`
- Format: `npx prettier -w .`
- Run an example (watch): `npm -w examples/beerpub-yoga run dev`
- Start an example (compiled): `npm -w examples/beerpub-yoga run start`
- Regenerate/packages sync (internal): `npm run sync` (runs codegen + builds + commits; use with care)

## Coding Style & Naming Conventions
- Language: TypeScript with ESM (`"type": "module"`).
- Formatting (Prettier): 2‑space indent, 120 columns, single quotes, semicolons, trailing commas.
- Linting: ESLint flat config with `typescript-eslint`; keep zero warnings before merging.
- Naming: camelCase for variables/functions, PascalCase for types/classes, kebab-case for filenames.
- Imports: use explicit relative paths; prefer named exports.

## Testing Guidelines
- Framework: Node’s built-in `node:test` with `assert`.
- Location/Names: colocate tests next to code; suffix with `.test.ts` or `.test.js`.
- Run: `npm test`; keep tests deterministic and fast. Cover core logic and adapters.

## Commit & Pull Request Guidelines
- Commits: concise, imperative present; link issues when relevant (e.g., `fix: handle null args (#123)`).
- PRs: clear description, linked issues, steps to test (which example/workspace), and notes on schema/adapter changes. Include screenshots/logs if UI/devtools output helps.
- Pre-merge: build all workspaces, run tests, lint, and format.

## Security & Configuration Tips
- Do not commit secrets. Configure example servers via environment or local config files; default dev ports are local (e.g., 4000).
- Keep ESM compatibility in mind when adding new packages and imports.
