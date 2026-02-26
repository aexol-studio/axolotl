import { GraphQLError } from 'graphql';
import { prisma } from '@/src/db.js';
import { getTokenFromCookies } from '@/src/utils/cookies.js';
import { verifyToken, type JwtPayload } from '@/src/utils/auth.js';

export interface AuthResult {
  _id: string;
  email: string;
  jti: string;
}

/**
 * Shared auth verification for gateway resolvers (Query.user / Mutation.user).
 *
 * Flow:
 * 1. Extract JWT from cookie header (fallback: raw token header for non-browser clients)
 * 2. Verify JWT signature and decode payload
 * 3. Check session exists in DB and is not expired (JTI existence check)
 * 4. Return user identity from JWT payload (no User table query needed)
 */
export const verifyAuth = async (cookieHeader: string | null, tokenHeader: string | null): Promise<AuthResult> => {
  const rawToken = getTokenFromCookies(cookieHeader) || tokenHeader;

  if (!rawToken) {
    throw new GraphQLError('Not authorized', { extensions: { code: 'UNAUTHORIZED' } });
  }

  let payload: JwtPayload;
  try {
    payload = verifyToken(rawToken);
  } catch {
    throw new GraphQLError('Not authorized', { extensions: { code: 'UNAUTHORIZED' } });
  }

  // Verify session exists and is not expired (enables server-side revocation)
  const sessionExists = await prisma.session.findFirst({
    where: {
      token: payload.jti,
      expiresAt: { gt: new Date() },
    },
    select: { token: true },
  });

  if (!sessionExists) {
    throw new GraphQLError('Not authorized', { extensions: { code: 'UNAUTHORIZED' } });
  }

  return { _id: payload.userId, email: payload.email, jti: payload.jti };
};
