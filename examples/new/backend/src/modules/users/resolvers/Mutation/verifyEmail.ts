import { GraphQLError } from 'graphql';
import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';
import { signToken, generateSessionToken, getSessionExpiryDate } from '@/src/utils/auth.js';

export default createResolvers({
  Mutation: {
    verifyEmail: async (input, { token }) => {
      const context = input[2];

      // Look up a valid (unused, unexpired) verification token
      const verificationToken = await prisma.emailVerificationToken.findFirst({
        where: {
          token,
          usedAt: null,
          expiresAt: { gt: new Date() },
        },
        include: { user: true },
      });

      if (!verificationToken) {
        // Check if token exists but is expired or already used for a better error message
        const existingToken = await prisma.emailVerificationToken.findFirst({
          where: { token },
        });

        if (!existingToken) {
          throw new GraphQLError('Invalid verification token', {
            extensions: { code: 'INVALID_TOKEN' },
          });
        }

        if (existingToken.usedAt) {
          throw new GraphQLError('This verification token has already been used', {
            extensions: { code: 'TOKEN_ALREADY_USED' },
          });
        }

        throw new GraphQLError('Verification token has expired', {
          extensions: { code: 'TOKEN_EXPIRED' },
        });
      }

      const sessionToken = generateSessionToken();

      // Atomically: mark token as used, verify user email, delete all other tokens for this user, create session
      const { user, session } = await prisma.$transaction(async (tx) => {
        // Mark the token as used
        await tx.emailVerificationToken.update({
          where: { id: verificationToken.id },
          data: { usedAt: new Date() },
        });

        // Mark user as email verified
        const user = await tx.user.update({
          where: { id: verificationToken.userId },
          data: { emailVerified: true },
        });

        // Delete all other verification tokens for this user (cleanup)
        await tx.emailVerificationToken.deleteMany({
          where: {
            userId: verificationToken.userId,
            id: { not: verificationToken.id },
          },
        });

        // Create a session so the user is logged in after verification
        const session = await tx.session.create({
          data: {
            token: sessionToken,
            userId: user.id,
            expiresAt: getSessionExpiryDate(),
            userAgent: context.request.headers.get('user-agent') || undefined,
          },
        });

        return { user, session };
      });

      // Sign JWT with session jti for stateful session tracking
      const jwt = signToken({ userId: user.id, email: user.email, jti: session.token });

      // Set auth cookie so the user is authenticated immediately after verification
      context.setCookie(jwt);

      return jwt;
    },
  },
});
