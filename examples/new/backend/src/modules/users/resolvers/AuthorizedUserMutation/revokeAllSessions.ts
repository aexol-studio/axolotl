import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';
import { verifyToken } from '@/src/lib/auth.js';
import { getTokenFromCookies } from '@/src/lib/cookies.js';

export default createResolvers({
  AuthorizedUserMutation: {
    revokeAllSessions: async ([, , context]) => {
      // Get current session JTI to exclude it from deletion
      const cookieHeader = context.request.headers.get('cookie');
      const token = getTokenFromCookies(cookieHeader);
      if (token) {
        const payload = verifyToken(token);
        await prisma.session.deleteMany({
          where: {
            userId: context.authUser!._id,
            token: { not: payload.jti },
          },
        });
      }

      return true;
    },
  },
});
