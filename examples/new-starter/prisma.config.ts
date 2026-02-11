///<reference types="node" />
import { defineConfig } from 'prisma/config';
import 'dotenv/config';

const getDatabaseUrl = (): string => {
  const { PGUSER, PGPASSWORD, PGDATABASE, PGHOST } = process.env;
  if (PGUSER && PGPASSWORD && PGDATABASE && PGHOST) {
    let port = 5432;
    if (process.env.DB_PORT) port = parseInt(process.env.DB_PORT, 10);
    return `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${port}/${PGDATABASE}`;
  }

  return process.env['DATABASE_URL'] || '';
};

export default defineConfig({
  schema: 'backend/src/prisma/schema.prisma',
  migrations: {
    path: 'backend/src/prisma/migrations',
    seed: process.env.NODE_ENV === 'production' ? 'node lib/prisma/seed.js' : 'tsx backend/src/prisma/seed.ts',
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
