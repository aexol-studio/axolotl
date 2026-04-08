import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';
import { getDatabaseUrl } from './env.js';
const connectionString = getDatabaseUrl();
const adapter = new PrismaPg({ connectionString });
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = prisma;
export default prisma;
//# sourceMappingURL=db.js.map