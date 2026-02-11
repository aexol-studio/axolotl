# new-starter (example)

Federated GraphQL Yoga example built with Axolotl. Demonstrates user authentication, todo CRUD operations with PostgreSQL/Prisma 7, and a React frontend with Tailwind CSS v4 using the Zeus GraphQL client.

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

## Architecture

- **Backend**: Express + GraphQL Yoga (served at `/graphql`)
- **Frontend**: Vite + React + Tailwind CSS v4 + Zeus (served at `/`)
- **Database**: PostgreSQL with Prisma 7

In development, Vite runs as Express middleware for HMR. In production, Express serves the built frontend from `dist/frontend/`.

## Features

- User registration and login with JWT tokens
- Todo CRUD operations (create, read, mark as done)
- Type-safe GraphQL client using Zeus
- PostgreSQL persistence with Prisma 7

## Database Setup

This example uses PostgreSQL with Prisma 7. Docker Compose is provided for running a local development database only (it does not run the application itself):

```sh
docker-compose up -d
```

Default connection string: `postgresql://axolotl:axolotl@localhost:5533/axolotl?schema=public`

### Prisma 7 Notes

- The Prisma client is generated locally in `backend/src/prisma/generated/` (not in node_modules)
- Uses driver adapters (`@prisma/adapter-pg`) for database connections
- Configuration is in `prisma.config.ts`
- Import the client from `./prisma/generated/prisma/client.js` (relative from `backend/src/db.ts`)

## Docker Deployment

### Local Development Database (Docker Compose)

Docker Compose is used **only** for running the local PostgreSQL database during development — it does not run the application itself.

```bash
docker-compose up -d
```

This will:

- Start PostgreSQL with pgvector extension on port 5533
- Store data in a persistent Docker volume

### Production Build

Build and run just the app container:

```bash
docker build -t new-starter .
docker run -p 4102:4102 \
  -e PGUSER=axolotl \
  -e PGPASSWORD=axolotl \
  -e PGDATABASE=axolotl \
  -e PGHOST=your-db-host \
  new-starter
```

## Entry points

- Server: `backend/src/index.ts`
- Resolvers: `backend/src/resolvers.ts`
- Schema: `backend/schema.graphql`
- Frontend: `frontend/src/App.tsx`
- Zeus client: `frontend/src/zeus/index.ts`
- Database client: `backend/src/db.ts`
- Prisma schema: `backend/src/prisma/schema.prisma`
