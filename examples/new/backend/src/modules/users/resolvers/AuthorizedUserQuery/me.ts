import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';

export default createResolvers({
  AuthorizedUserQuery: {
    me: async ([, , context]) => {
      // Fetch full user from DB to include createdAt (context.authUser only has _id + email)
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: context.authUser!._id },
        select: { id: true, email: true, createdAt: true },
      });

      return {
        _id: user.id,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      };
    },
  },
});
