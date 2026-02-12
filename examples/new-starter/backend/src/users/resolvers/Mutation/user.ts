import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';
import { getTokenFromCookies } from '@/src/lib/cookies.js';

export default createResolvers({
  Mutation: {
    user: async (input) => {
      const cookieHeader = input[2].request.headers.get('cookie');
      const token = getTokenFromCookies(cookieHeader) || input[2].request.headers.get('token');
      if (!token) throw new Error('Not authorized');
      const user = await prisma.user.findFirst({ where: { token } });
      if (!user) throw new Error('Not authorized');
      return { _id: user.id, username: user.username };
    },
  },
});
