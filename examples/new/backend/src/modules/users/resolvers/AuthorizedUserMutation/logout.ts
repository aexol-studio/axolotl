import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';

export default createResolvers({
  AuthorizedUserMutation: {
    logout: async ([, , context]) => {
      const jti = context.authUser!.jti;

      // Delete the current session from DB (ignore if already gone)
      await prisma.session.delete({ where: { token: jti } }).catch(() => {});

      // Clear the httpOnly auth cookie
      context.clearCookie();

      return true;
    },
  },
});
