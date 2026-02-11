import { GraphQLError } from 'graphql';
import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';

export default createResolvers({
  Mutation: {
    register: async (_, { password, username }) => {
      const userExists = await prisma.user.findUnique({
        where: { username },
      });
      if (userExists)
        throw new GraphQLError('User with that username already exists', { extensions: { code: 'USER_EXISTS' } });
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
