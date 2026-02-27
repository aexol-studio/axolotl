import { z } from 'zod';
import { GraphQLError } from 'graphql';
import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';
import { hashPassword, verifyPassword, verifyToken } from '@/src/utils/auth.js';
import { getTokenFromCookies } from '@/src/utils/cookies.js';
import { parseInput, passwordSchema } from '@/src/utils/validation.js';

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

export default createResolvers({
  AuthorizedUserMutation: {
    changePassword: async ([, , context], { oldPassword: rawOldPassword, newPassword: rawNewPassword }) => {
      const { oldPassword, newPassword } = parseInput(changePasswordSchema, {
        oldPassword: rawOldPassword,
        newPassword: rawNewPassword,
      });

      // Fetch current user to verify old password
      const user = await prisma.user.findUniqueOrThrow({ where: { id: context.authUser!._id } });

      // Verify old password matches before allowing change
      const isValid = await verifyPassword(oldPassword, user.password);
      if (!isValid) {
        throw new GraphQLError('Current password is incorrect', { extensions: { code: 'INVALID_CREDENTIALS' } });
      }

      // Hash the new password with bcrypt before storage
      const hashedPassword = await hashPassword(newPassword);

      // Update the user's password in DB
      await prisma.user.update({
        where: { id: context.authUser!._id },
        data: { password: hashedPassword },
      });

      // Invalidate all sessions EXCEPT the current one (security: password change logs out other devices)
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
