import { z } from 'zod';
import { GraphQLError } from 'graphql';
import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';
import { verifyPassword } from '@/src/lib/auth.js';
import { parseInput } from '@/src/lib/validation.js';

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export default createResolvers({
  AuthorizedUserMutation: {
    deleteAccount: async ([, , context], { password: rawPassword }) => {
      const { password } = parseInput(deleteAccountSchema, { password: rawPassword });

      // Fetch user to verify password against stored hash
      const user = await prisma.user.findUniqueOrThrow({ where: { id: context.authUser!._id } });

      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        throw new GraphQLError('Incorrect password', { extensions: { code: 'INVALID_CREDENTIALS' } });
      }

      // Delete user — Prisma cascade auto-deletes all sessions and related data
      await prisma.user.delete({ where: { id: context.authUser!._id } });

      // Clear the auth cookie so the browser drops the token immediately.
      context.clearCookie();

      return true;
    },
  },
});
