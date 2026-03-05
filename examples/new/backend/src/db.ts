import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './prisma/generated/prisma/client.js';
import { getDatabaseUrl } from './config/env.js';
import { IS_PRODUCTION } from './config/env.js';

const connectionString = getDatabaseUrl();
const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (!IS_PRODUCTION) globalForPrisma.prisma = prisma;

export default prisma;
