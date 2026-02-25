import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';
import { verifyToken } from '@/src/lib/auth.js';
import { getTokenFromCookies } from '@/src/lib/cookies.js';

/**
 * Extracts the current session's JTI from the request cookie.
 * Returns null if the cookie is missing or the token is invalid.
 */
const getCurrentJti = (cookieHeader: string | null): string | null => {
  const token = getTokenFromCookies(cookieHeader);
  if (!token) return null;

  try {
    const payload = verifyToken(token);
    return payload.jti;
  } catch {
    return null;
  }
};

export default createResolvers({
  AuthorizedUserQuery: {
    sessions: async ([, , context]) => {
      const currentJti = getCurrentJti(context.request.headers.get('cookie'));

      const sessions = await prisma.session.findMany({
        where: { userId: context.authUser!._id },
        orderBy: { createdAt: 'desc' },
      });

      return sessions.map((session) => ({
        _id: session.token,
        userAgent: session.userAgent,
        createdAt: session.createdAt.toISOString(),
        expiresAt: session.expiresAt.toISOString(),
        isCurrent: session.token === currentJti,
      }));
    },
  },
});
