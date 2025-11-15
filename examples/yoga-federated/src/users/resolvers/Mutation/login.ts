import { createResolvers } from '../../axolotl.js';
import { db } from '../../db.js';

export default createResolvers({
  Mutation: {
    login: async (_, { password, username }) => {
      return db.users.find((u) => u.username === username && u.password === password)?.token;
    },
  },
});
