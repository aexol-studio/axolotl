import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';
import type { Note as PrismaNote } from '@/src/prisma/generated/prisma/client.js';

export default createResolvers({
  AuthorizedUserQuery: {
    notes: async ([, , context]) => {
      const notes = await prisma.note.findMany({
        where: { userId: context.authUser!._id },
        orderBy: { createdAt: 'desc' },
      });
      return notes.map((n: PrismaNote) => ({
        id: n.id,
        content: n.content,
        status: n.status,
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      }));
    },
  },
});
