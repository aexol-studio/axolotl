import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';
import type { Note as PrismaNote } from '@/src/prisma/generated/prisma/client.js';

export default createResolvers({
  AuthorizedUserQuery: {
    note: async ([source], { id }) => {
      const src = source as { _id: string; email: string };
      const found: PrismaNote | null = await prisma.note.findFirst({
        where: { id, userId: src._id },
      });
      if (!found) return null;
      return {
        id: found.id,
        content: found.content,
        status: found.status,
        createdAt: found.createdAt.toISOString(),
        updatedAt: found.updatedAt.toISOString(),
      };
    },
  },
});
