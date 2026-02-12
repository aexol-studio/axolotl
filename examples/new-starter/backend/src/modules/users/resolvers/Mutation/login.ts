import { GraphQLError } from 'graphql';
import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';
import { serializeSetCookie } from '@/src/lib/cookies.js';

export default createResolvers({
  Mutation: {
    login: async (input, { password, username }) => {
      const user = await prisma.user.findUnique({
        where: { username },
      });
      if (!user || user.password !== password)
        throw new GraphQLError('Invalid username or password', { extensions: { code: 'INVALID_CREDENTIALS' } });

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
