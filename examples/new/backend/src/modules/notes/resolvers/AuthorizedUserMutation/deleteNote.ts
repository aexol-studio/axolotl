import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';

export default createResolvers({
  AuthorizedUserMutation: {
    deleteNote: async ([source], { id }) => {
      const src = source as { _id: string; email: string };
      await prisma.note.deleteMany({
        where: { id, userId: src._id },
      });
      return true;
    },
  },
});
