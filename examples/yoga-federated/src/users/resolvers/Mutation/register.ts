import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';

export default createResolvers({
  Mutation: {
    register: async (_, { password, username }) => {
      const userExists = await prisma.user.findUnique({
        where: { username },
      });
      if (userExists) throw new Error('User with that username already exists');
      const token = Math.random().toString(16);
      const user = await prisma.user.create({
        data: {
          username,
          password,
          token,
        },
      });
      return user.token;
    },
  },
});
