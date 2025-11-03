# @aexol/axolotl — README (from npm)

# @aexol/axolotl (CLI)

Command‑line interface for the Axolotl framework. It scaffolds starters, generates/inspects resolvers, runs chaos tests, and can spin up an MCP server for GraphQL.

## Common Commands

- Create starters: `axolotl create-<starter> [dir]` (see `packages/cli/create/consts.ts` for list)
- Create Dockerfile: `axolotl create-dockerfile`
- Build models from schema: `axolotl build`
- Inspect resolvers vs schema: `axolotl inspect -s schema.graphql -r ./lib/resolvers.js`
- Chaos testing against endpoint: `axolotl chaos -s schema.graphql -u http://localhost:4000/graphql`
- AI resolver codegen: `axolotl ai <schemaPath> <type> <field> <prompt> [existing_resolver_path]`
- Frontend/GraphQL AI helpers: `axolotl frontend-ai …`, `axolotl graphql-ai …`
- MCP server for GraphQL: `axolotl mcp <schema> [--endpoint <url>] [-H "Key: Value"]`

Environment for AI commands is read via `@aexol/axolotl-config` (see `packages/config`).

## Usage

- Global: `npm i -g @aexol/axolotl`
- Local via npx: `npx @aexol/axolotl <command>`

Examples use these scripts in workspaces under `examples/` and `modularium/`.

## Develop

- Build: `npm run build --ws --if-present`
- Test: `npm test`
- Lint: `npx eslint packages/cli`
