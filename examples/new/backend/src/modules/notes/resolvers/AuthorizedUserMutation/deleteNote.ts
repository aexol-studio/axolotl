import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';

export default createResolvers({
  AuthorizedUserMutation: {
    deleteNote: async ([, , context], { id }) => {
      // Scoped delete ensures only the owner's note is affected
      await prisma.note.deleteMany({
        where: { id, userId: context.authUser!._id },
      });
      return true;
    },
  },
});
