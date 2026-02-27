import { GraphQLError } from 'graphql';
import { z } from 'zod';
import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';
import { hashPassword, signToken, generateSessionToken, getSessionExpiryDate } from '@/src/utils/auth.js';
import { parseInput, emailSchema, passwordSchema } from '@/src/utils/validation.js';

const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export default createResolvers({
  Mutation: {
    register: async (input, { password: rawPassword, email: rawEmail }) => {
      const { email, password } = parseInput(registerSchema, { email: rawEmail, password: rawPassword });

      const userExists = await prisma.user.findFirst({
        where: { email },
      });
      if (userExists)
        throw new GraphQLError('User with that email already exists', { extensions: { code: 'EMAIL_EXISTS' } });

      const hashedPassword = await hashPassword(password);
      const sessionToken = generateSessionToken();

      // Create user and session atomically
      const context = input[2];
      const { user, session } = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: { email, password: hashedPassword },
        });
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

      // Set auth cookie on the response so the browser stores the JWT automatically
      context.setCookie(jwt);

      return jwt;
    },
  },
});
