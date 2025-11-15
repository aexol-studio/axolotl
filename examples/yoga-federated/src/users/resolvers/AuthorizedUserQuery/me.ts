import { createResolvers } from '../../axolotl.js';
import { UserModel } from '../../db.js';

export default createResolvers({
  AuthorizedUserQuery: {
    me: ([source]) => {
      const src = source as UserModel;
      return src;
    },
  },
});
