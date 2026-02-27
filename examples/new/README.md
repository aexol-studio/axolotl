# Axolotl Fullstack Starter

A production-ready starter for fullstack TypeScript apps. Axolotl GraphQL backend + React SSR frontend, ready to build on.

## Getting started

1. Install dependencies:

```sh
npm install
```

2. Create your environment file:

```sh
cp .env.example .env
```

Edit `.env` if you need to change any default values (database credentials, API keys, etc.).

3. Start the local development database:

```sh
docker-compose up -d
```

4. Push the schema to the database:

```sh
npm run db:push
```

5. Start development server:

```sh
npm run dev
```

This starts both the GraphQL backend and React frontend on the same port (http://localhost:4102).

## Scripts

- `npm run dev` - Start development server with hot reload (backend + frontend)
- `npm run build` - Build both backend and frontend for production
- `npm run start` - Run production build
- `npm run models` - Generate models from schema (`cd backend && axolotl build`)
- `npm run resolvers` - Generate resolver stubs (`cd backend && axolotl resolvers`)
- `npm run inspect` - Compare resolvers vs schema (`cd backend && axolotl inspect`)
- `npm run chaos` - Run chaos tests against the running server

### Database (Prisma 7)

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and apply migrations
- `npm run db:studio` - Open Prisma Studio GUI
- `npm run db:seed` - Run database seed

## Features

- Axolotl schema-first GraphQL backend with micro-federation
- React + Vite SSR (server-side rendering with streaming)
- Tailwind CSS v4 + shadcn/ui components
- Zeus type-safe GraphQL client
- JWT + session authentication (httpOnly cookies)
- PostgreSQL + Prisma 7
- Dark mode (class-based)
- i18n with @aexol/dynamite
- React Query for server state
- Zustand for client state

## Architecture

- **Backend**: Express + GraphQL Yoga (served at `/graphql`)
- **Frontend**: Vite + React + Tailwind CSS v4 + Zeus (served at `/`)
- **Database**: PostgreSQL with Prisma 7

In development, Vite runs as Express middleware for HMR. In production, Express serves the built frontend from `dist/frontend/`.

## Entry Points

- Server: `backend/src/index.ts`
- Resolvers: `backend/src/resolvers.ts`
- Schema: `backend/schema.graphql`
- SSR client entry: `frontend/src/entry-client.tsx`
- SSR server entry: `frontend/src/entry-server.tsx`
- Root route layout: `frontend/src/routes/RootLayout.tsx`
- Route config: `frontend/src/routes/index.tsx`
- Zeus client: `frontend/src/zeus/index.ts`
- Database client: `backend/src/db.ts`
- Prisma schema: `backend/src/prisma/schema.prisma`

## Included Examples

The `todos` backend module and `/examples` frontend route are included for demonstration — safe to remove.

## Docker

Development database:

```sh
docker-compose up -d    # PostgreSQL on port 5533
```

Production:

```sh
docker build -t my-app .
docker run -p 4102:4102 -e PGHOST=... -e PGUSER=... -e PGPASSWORD=... -e PGDATABASE=... my-app
```

## Prisma 7 Notes

- Client is generated locally in `backend/src/prisma/generated/` (not in node_modules)
- Uses driver adapters (`@prisma/adapter-pg`) for database connections
- Configuration is in `prisma.config.ts`; import client from `./prisma/generated/prisma/client.js`
