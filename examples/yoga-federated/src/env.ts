import 'dotenv/config';

/**
 * Construct DATABASE_URL from individual PG* environment variables if available.
 * Falls back to DATABASE_URL if individual vars are not set.
 *
 * This supports Docker/cloud deployments where individual PG vars are common:
 * - PGUSER, PGPASSWORD, PGDATABASE, PGHOST
 */
export const getDatabaseUrl = (): string => {
  const { PGUSER, PGPASSWORD, PGDATABASE, PGHOST } = process.env;

  if (PGUSER && PGPASSWORD && PGDATABASE && PGHOST) {
    return `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:5432/${PGDATABASE}`;
  }

  return process.env['DATABASE_URL'] || '';
};
