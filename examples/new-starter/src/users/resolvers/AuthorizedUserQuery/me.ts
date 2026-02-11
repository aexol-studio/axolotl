import { createResolvers } from '../../axolotl.js';
import { User } from '../../models.js';

export default createResolvers({
  AuthorizedUserQuery: {
    me: ([source]) => {
      const src = source as User;
      return src;
    },
  },
});
