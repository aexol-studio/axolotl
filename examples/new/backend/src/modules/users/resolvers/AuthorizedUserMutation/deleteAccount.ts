import { z } from 'zod';
import { GraphQLError } from 'graphql';
import { createResolvers } from '../../axolotl.js';
import { User } from '../../models.js';
import { prisma } from '@/src/db.js';
import { verifyPassword } from '@/src/lib/auth.js';
import { serializeClearCookie } from '@/src/lib/cookies.js';
import { parseInput } from '@/src/lib/validation.js';
import type { AppContext } from '@/src/lib/context.js';

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export default createResolvers({
  AuthorizedUserMutation: {
    deleteAccount: async ([source, , ctx], { password: rawPassword }) => {
      const context = ctx as AppContext;
      const { password } = parseInput(deleteAccountSchema, { password: rawPassword });

      const src = source as User;

      // Fetch user to verify password against stored hash
      const user = await prisma.user.findUniqueOrThrow({ where: { id: src._id } });

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        throw new GraphQLError('Incorrect password', { extensions: { code: 'INVALID_CREDENTIALS' } });
      }

      // Delete user — Prisma cascade auto-deletes all sessions and related data
      await prisma.user.delete({ where: { id: src._id } });

      // Clear the auth cookie so the browser drops the token immediately
      const { res } = context;
      if (res) {
        res.setHeader('Set-Cookie', serializeClearCookie());
      }

      return true;
    },
  },
});
