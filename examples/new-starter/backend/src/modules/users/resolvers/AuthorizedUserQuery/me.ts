import { createResolvers } from '../../axolotl.js';
import { User } from '../../models.js';
import { prisma } from '@/src/db.js';

export default createResolvers({
  AuthorizedUserQuery: {
    me: async ([source]) => {
      const src = source as User;

      // Fetch full user from DB to include createdAt (gateway source only has _id + email)
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: src._id },
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
