import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';
import type { Note as PrismaNote } from '@/src/prisma/generated/prisma/client.js';
import { NoteStatus } from '@/src/prisma/generated/prisma/client.js';

export default createResolvers({
  AuthorizedUserMutation: {
    createNote: async ([, , context], { input }) => {
      const note: PrismaNote = await prisma.note.create({
        data: {
          content: input.content,
          status: (input.status as NoteStatus) ?? NoteStatus.ACTIVE,
          userId: context.authUser!._id,
        },
      });
      return {
        id: note.id,
        content: note.content,
        status: note.status,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
      };
    },
  },
});
