import { createResolvers } from '../../axolotl.js';
import { verifyAuth } from '../../lib/verifyAuth.js';

export default createResolvers({
  Query: {
    user: async (input) => {
      const cookieHeader = input[2].request.headers.get('cookie');
      const tokenHeader = input[2].request.headers.get('token');
      return verifyAuth(cookieHeader, tokenHeader);
    },
  },
});
