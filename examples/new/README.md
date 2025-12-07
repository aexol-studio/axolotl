# new (example)

Simple "Hello World" GraphQL example built with Axolotl. Includes a React frontend with Tailwind CSS v4.

## Getting started

1. Install dependencies:

```sh
npm install
```

2. Create your schema inside `schema.graphql`

3. Start development server:

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

## Architecture

- **Backend**: Express + GraphQL Yoga (served at `/graphql`)
- **Frontend**: Vite + React + Tailwind CSS v4 (served at `/`)

In development, Vite runs as Express middleware for HMR. In production, Express serves the built frontend from `dist/frontend/`.

## Entry points

- Server: `src/index.ts`
- Resolvers: `src/resolvers.ts`
- Schema: `schema.graphql`
- Frontend: `frontend/src/App.tsx`
