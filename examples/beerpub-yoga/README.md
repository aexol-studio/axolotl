# beerpub-yoga (example)

Example Beer Pub API running on GraphQL Yoga with Axolotl.

## Scripts

- `npm -w examples/beerpub-yoga run dev` – watch and run with Nodemon
- `npm -w examples/beerpub-yoga run start` – run compiled build
- `npm -w examples/beerpub-yoga run build` – compile TypeScript
- `npm -w examples/beerpub-yoga run models` – generate models from schema
- `npm -w examples/beerpub-yoga run inspect` – compare resolvers vs schema
- `npm -w examples/beerpub-yoga run chaos` – run chaos tests against the running server

Entry points:

- Server: `examples/beerpub-yoga/src/index.ts:1`
- Resolvers: `examples/beerpub-yoga/src/resolvers.ts:1`
- Schema: `examples/beerpub-yoga/schema.graphql:1`
