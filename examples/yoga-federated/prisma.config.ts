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
  schema: 'src/prisma/schema.prisma',
  migrations: {
    path: 'src/prisma/migrations',
    seed: process.env.NODE_ENV === 'production' ? 'node lib/prisma/seed.js' : 'tsx src/prisma/seed.ts',
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
