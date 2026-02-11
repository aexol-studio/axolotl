import { GraphQLError } from 'graphql';
import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';

export default createResolvers({
  Mutation: {
    login: async (_, { password, username }) => {
      const user = await prisma.user.findUnique({
        where: { username },
      });
      if (!user || user.password !== password)
        throw new GraphQLError('Invalid username or password', { extensions: { code: 'INVALID_CREDENTIALS' } });
      return user.token;
    },
  },
});
