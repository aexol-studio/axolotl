import { createResolvers } from '../../axolotl.js';
import { User } from '../../models.js';
import { prisma } from '@/src/db.js';
import { verifyToken } from '@/src/lib/auth.js';
import { getTokenFromCookies } from '@/src/lib/cookies.js';
import type { AppContext } from '@/src/lib/context.js';

export default createResolvers({
  AuthorizedUserMutation: {
    revokeAllSessions: async ([source, , ctx]) => {
      const context = ctx as AppContext;
      const src = source as User;

      // Get current session JTI to exclude it from deletion
      const cookieHeader = context.request.headers.get('cookie');
      const token = getTokenFromCookies(cookieHeader);
      if (token) {
        const payload = verifyToken(token);
        await prisma.session.deleteMany({
          where: {
            userId: src._id,
            token: { not: payload.jti },
          },
        });
      }

      return true;
    },
  },
});
