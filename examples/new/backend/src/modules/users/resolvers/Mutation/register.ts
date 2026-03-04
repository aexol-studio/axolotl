import crypto from 'node:crypto';
import { GraphQLError } from 'graphql';
import { z } from 'zod';
import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';
import { hashPassword, signToken, generateSessionToken, getSessionExpiryDate } from '@/src/utils/auth.js';
import { parseInput, emailSchema, passwordSchema } from '@/src/utils/validation.js';
import { DISABLE_EMAIL_VERIFICATION } from '@/src/config/env.js';
import { sendVerificationEmail } from '@/src/services/mailgun/templates/renderVerificationEmail.js';

const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/** Verification token expiry: 24 hours from now */
const getVerificationTokenExpiry = (): Date => new Date(Date.now() + 24 * 60 * 60 * 1000);

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

      // Flag OFF (default): immediate login — exact existing behavior + emailVerified: true
      if (DISABLE_EMAIL_VERIFICATION) {
        const sessionToken = generateSessionToken();

        const context = input[2];
        const { user, session } = await prisma.$transaction(async (tx) => {
          const user = await tx.user.create({
            data: { email, password: hashedPassword, emailVerified: true },
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

        return 'Account created successfully';
      }

      // Flag ON: create unverified user + verification token, send email, no session/cookie
      const verificationToken = crypto.randomUUID();

      await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: { email, password: hashedPassword, emailVerified: false },
        });
        await tx.emailVerificationToken.create({
          data: {
            token: verificationToken,
            userId: user.id,
            expiresAt: getVerificationTokenExpiry(),
          },
        });
      });

      await sendVerificationEmail(email, verificationToken);

      return 'Please check your email to verify your account';
    },
  },
});
