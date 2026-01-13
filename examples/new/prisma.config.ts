import 'dotenv/config';
import { defineConfig } from 'prisma/config';

if (process.env.NODE_ENV !== 'production') {
  await import('dotenv/config');
}

// Construct DATABASE_URL from individual PG* environment variables if available
// Falls back to DATABASE_URL if individual vars are not set
const getDatabaseUrl = (): string => {
  const { PGUSER, PGPASSWORD, PGDATABASE, PGHOST } = process.env;

  if (PGUSER && PGPASSWORD && PGDATABASE && PGHOST) {
    return `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:5432/${PGDATABASE}`;
  }

  return process.env['DATABASE_URL'] || '';
};

export default defineConfig({
  schema: 'src/prisma/schema.prisma',
  migrations: {
    path: 'src/prisma/migrations',
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
