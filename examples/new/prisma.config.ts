import { defineConfig } from 'prisma/config';
import { getDatabaseUrl } from './src/env.js';

export default defineConfig({
  schema: 'src/prisma/schema.prisma',
  migrations: {
    path: 'src/prisma/migrations',
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
