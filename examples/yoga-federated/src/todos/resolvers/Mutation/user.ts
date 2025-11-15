import { createResolvers } from '../../axolotl.js';
import { db as usersDb } from '@/src/users/db.js';

export default createResolvers({
  Mutation: {
    user: async (input) => {
      const token = input[2].request.headers.get('token');
      if (!token) throw new Error('Not authorized');
      const user = usersDb.users.find((u) => u.token === token);
      if (!user) throw new Error('Not authorized');
      return user;
    },
  },
});
