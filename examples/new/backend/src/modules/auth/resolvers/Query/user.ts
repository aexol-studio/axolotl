import { createResolvers } from '../../axolotl.js';
import { verifyAuth } from '../../lib/verifyAuth.js';
import type { AppContext } from '@/src/lib/context.js';

export default createResolvers({
  Query: {
    user: async (input) => {
      const context = input[2] as AppContext;
      const cookieHeader = context.request.headers.get('cookie');
      const tokenHeader = context.request.headers.get('token');
      return verifyAuth(cookieHeader, tokenHeader);
    },
  },
});
