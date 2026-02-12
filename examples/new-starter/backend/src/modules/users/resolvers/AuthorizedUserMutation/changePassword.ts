import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';
import { User } from '../../models.js';
import { hashPassword, verifyToken } from '../../../../lib/auth.js';
import { getTokenFromCookies } from '../../../../lib/cookies.js';

export default createResolvers({
  AuthorizedUserMutation: {
    changePassword: async ([source, , context], { newPassword }) => {
      const src = source as User;

      // Hash the new password with bcrypt before storage
      const hashedPassword = await hashPassword(newPassword);

      // Update the user's password in DB
      await prisma.user.update({
        where: { id: src._id },
        data: { password: hashedPassword },
      });

      // Invalidate all sessions EXCEPT the current one (security: password change logs out other devices)
      const cookieHeader = context.request.headers.get('cookie');
      const token = getTokenFromCookies(cookieHeader);
      if (token) {
        const payload = verifyToken(token);
        await prisma.session.deleteMany({
          where: {
            userId: src._id,
            token: { not: payload.jti },
          },
        });
      }

      return true;
    },
  },
});
