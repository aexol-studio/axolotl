import { createResolvers } from '../../axolotl.js';
import { db } from '../../db.js';

export default createResolvers({
  Mutation: {
    register: async (_, { password, username }) => {
      const userExists = db.users.find((u) => u.username === username);
      if (userExists) throw new Error('User with that username already exists');
      const token = Math.random().toString(16);
      const _id = Math.random().toString(8);
      db.users.push({
        _id,
        token,
        password,
        username,
      });
      return token;
    },
  },
});
