import { GraphQLError } from 'graphql';
import { createResolvers } from '../../axolotl.js';
import { User } from '../../models.js';
import { prisma } from '@/src/db.js';
import { verifyToken } from '@/src/lib/auth.js';
import { getTokenFromCookies } from '@/src/lib/cookies.js';

export default createResolvers({
  AuthorizedUserMutation: {
    revokeSession: async ([source, , context], { sessionId }) => {
      const src = source as User;

      // Determine current session JTI from cookie
      const cookieHeader = context.request.headers.get('cookie');
      const token = getTokenFromCookies(cookieHeader);
      if (token) {
        const payload = verifyToken(token);
        if (sessionId === payload.jti) {
          throw new GraphQLError('Cannot revoke current session', {
            extensions: { code: 'INVALID_INPUT' },
          });
        }
      }

      // Verify the session belongs to the current user
      const session = await prisma.session.findFirst({
        where: { token: sessionId, userId: src._id },
      });

      if (!session) {
        throw new GraphQLError('Session not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      await prisma.session.delete({ where: { token: sessionId } });

      return true;
    },
  },
});
