import { GraphQLError } from 'graphql';
import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';
import { serializeSetCookie } from '@/src/lib/cookies.js';

export default createResolvers({
  Mutation: {
    register: async (input, { password, username }) => {
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

      // Set auth cookie on the response so the browser stores the token automatically
      const context = input[2];
      const { res } = context;
      if (res && user.token) {
        res.setHeader('Set-Cookie', serializeSetCookie(user.token));
      } else if (!res) {
        console.warn('Cannot set auth cookie: ServerResponse not available in context');
      }

      return user.token;
    },
  },
});
