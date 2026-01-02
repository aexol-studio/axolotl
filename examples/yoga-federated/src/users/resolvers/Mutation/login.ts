import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';

export default createResolvers({
  Mutation: {
    login: async (_, { password, username }) => {
      const user = await prisma.user.findUnique({
        where: { username },
      });
      if (!user || user.password !== password) return undefined;
      return user.token;
    },
  },
});
