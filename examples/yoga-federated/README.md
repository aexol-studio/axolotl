# yoga-federated (example)

Federated GraphQL Yoga example built with Axolotl. Demonstrates user authentication, todo CRUD operations, and a React frontend with Tailwind CSS v4 using the Zeus GraphQL client.

## Getting started

1. Install dependencies:

```sh
npm install
```

2. Start development server:

```sh
npm run dev
```

This starts both the GraphQL backend and React frontend on the same port (http://localhost:4002).

## Scripts

- `npm run dev` - Start development server with hot reload (backend + frontend)
- `npm run build` - Build both backend and frontend for production
- `npm run start` - Run production build
- `npm run models` - Generate models from schema
- `npm run resolvers` - Generate resolver stubs
- `npm run inspect` - Compare resolvers vs schema
- `npm run chaos` - Run chaos tests against the running server

## Architecture

- **Backend**: Express + GraphQL Yoga (served at `/graphql`)
- **Frontend**: Vite + React + Tailwind CSS v4 + Zeus (served at `/`)

In development, Vite runs as Express middleware for HMR. In production, Express serves the built frontend from `dist/frontend/`.

## Features

- User registration and login with JWT tokens
- Todo CRUD operations (create, read, mark as done)
- Type-safe GraphQL client using Zeus

## Entry points

- Server: `src/index.ts`
- Resolvers: `src/resolvers.ts`
- Schema: `schema.graphql`
- Frontend: `frontend/src/App.tsx`
- Zeus client: `src/zeus/index.ts`
