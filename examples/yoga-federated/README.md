# yoga-federated (example)

Federated GraphQL Yoga example built with Axolotl. Demonstrates composing multiple modules (e.g., users, todos) into a single server.

## Scripts

- `npm -w examples/yoga-federated run dev` – watch and run with Nodemon
- `npm -w examples/yoga-federated run start` – run compiled build
- `npm -w examples/yoga-federated run build` – compile TypeScript
- `npm -w examples/yoga-federated run models` – generate models from schema
- `npm -w examples/yoga-federated run inspect` – compare resolvers vs schema
- `npm -w examples/yoga-federated run chaos` – run chaos tests against the running server

Entry points:

- Server: `examples/yoga-federated/src/index.ts:1`
- Resolvers: `examples/yoga-federated/src/resolvers.ts:1`
- Schema: `examples/yoga-federated/schema.graphql:1`
