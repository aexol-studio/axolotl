# new (example)

Simple "Hello World" GraphQL example built with Axolotl. Includes a React frontend with Tailwind CSS v4 and Prisma 7 for database access.

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

4. Create your schema inside `schema.graphql`

5. Start development server:

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

### Database (Prisma 7)

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and apply migrations
- `npm run db:studio` - Open Prisma Studio GUI
- `npm run db:seed` - Run database seed

## Architecture

- **Backend**: Express + GraphQL Yoga (served at `/graphql`)
- **Frontend**: Vite + React + Tailwind CSS v4 (served at `/`)
- **Database**: PostgreSQL with Prisma 7

In development, Vite runs as Express middleware for HMR. In production, Express serves the built frontend from `dist/frontend/`.

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
docker build -t axolotl-new .
docker run -p 4002:4002 -e DATABASE_URL="your-database-url" axolotl-new
```

## Entry points

- Server: `src/index.ts`
- Resolvers: `src/resolvers.ts`
- Schema: `schema.graphql`
- Frontend: `frontend/src/App.tsx`
- Database client: `src/db.ts`
- Prisma schema: `prisma/schema.prisma`
