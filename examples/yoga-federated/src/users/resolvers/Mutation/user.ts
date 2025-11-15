import { createResolvers } from '../../axolotl.js';
import { db } from '../../db.js';

export default createResolvers({
  Mutation: {
    user: async (input) => {
      const token = input[2].request.headers.get('token');
      if (!token) throw new Error('Not authorized');
      const user = db.users.find((u) => u.token === token);
      if (!user) throw new Error('Not authorized');
      return user;
    },
  },
});
