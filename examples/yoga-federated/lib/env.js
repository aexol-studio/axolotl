import 'dotenv/config';
export const getDatabaseUrl = () => {
    const { PGUSER, PGPASSWORD, PGDATABASE, PGHOST } = process.env;
    if (PGUSER && PGPASSWORD && PGDATABASE && PGHOST) {
        return `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:5432/${PGDATABASE}`;
    }
    return process.env['DATABASE_URL'] || '';
};
//# sourceMappingURL=env.js.map