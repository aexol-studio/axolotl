import { z } from 'zod';
import { GraphQLError } from 'graphql';
import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';
import { serializeSetCookie } from '@/src/lib/cookies.js';
import { verifyPassword, signToken, generateSessionToken, getSessionExpiryDate } from '@/src/lib/auth.js';
import { parseInput, emailSchema, passwordSchema } from '@/src/lib/validation.js';
import type { AppContext } from '@/src/lib/context.js';

const loginSchema = z.object({ email: emailSchema, password: passwordSchema });

export default createResolvers({
  Mutation: {
    login: async (input, { password: rawPassword, email: rawEmail }) => {
      const { email, password } = parseInput(loginSchema, { email: rawEmail, password: rawPassword });

      const user = await prisma.user.findFirst({
        where: { email },
      });

      if (!user) {
        throw new GraphQLError('Invalid credentials', { extensions: { code: 'INVALID_CREDENTIALS' } });
      }

      const isValid = await verifyPassword(password, user.password);

      if (!isValid) {
        throw new GraphQLError('Invalid credentials', { extensions: { code: 'INVALID_CREDENTIALS' } });
      }

      // Create a new session for multi-device support
      const context = input[2] as AppContext;
      const sessionToken = generateSessionToken();
      const session = await prisma.session.create({
        data: {
          token: sessionToken,
          userId: user.id,
          expiresAt: getSessionExpiryDate(),
          userAgent: context.request.headers.get('user-agent') || undefined,
        },
      });

      // Sign JWT with session token as JTI for revocation support
      const jwtToken = signToken({ userId: user.id, email: user.email, jti: session.token });

      // Set auth cookie on the response so the browser stores the token automatically
      const { res } = context;
      if (res) {
        res.setHeader('Set-Cookie', serializeSetCookie(jwtToken));
      } else {
        console.warn('Cannot set auth cookie: ServerResponse not available in context');
      }

      return jwtToken;
    },
  },
});
