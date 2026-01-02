# yoga-federated (example)

Federated GraphQL Yoga example built with Axolotl. Demonstrates user authentication, todo CRUD operations with PostgreSQL/Prisma 7, and a React frontend with Tailwind CSS v4 using the Zeus GraphQL client.

## Getting started

1. Install dependencies:

```sh
npm install
```

2. Start the database:

```sh
docker-compose up -d
```

3. Push the schema to the database:

```sh
npm run db:push
```

4. Start development server:

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

This example uses PostgreSQL with Prisma 7. The database can be started with Docker Compose:

```sh
docker-compose up -d
```

Default connection string: `postgresql://axolotl:axolotl@localhost:5432/axolotl?schema=public`

### Prisma 7 Notes

- The Prisma client is generated locally in `prisma/generated/` (not in node_modules)
- Uses driver adapters (`@prisma/adapter-pg`) for database connections
- Configuration is in `prisma.config.ts`
- Import the client from `./prisma/generated/prisma/client.js`

## Docker Deployment

Build and run the Docker image:

```sh
docker build -t axolotl-yoga-federated .
docker run -p 4002:4002 -e DATABASE_URL="your-database-url" axolotl-yoga-federated
```

## Entry points

- Server: `src/index.ts`
- Resolvers: `src/resolvers.ts`
- Schema: `schema.graphql`
- Frontend: `frontend/src/App.tsx`
- Zeus client: `src/zeus/index.ts`
- Database client: `src/db.ts`
- Prisma schema: `prisma/schema.prisma`
