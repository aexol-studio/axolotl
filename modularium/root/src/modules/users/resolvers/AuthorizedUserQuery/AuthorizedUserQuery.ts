import { createResolvers } from '@/src/modules/users/axolotl.js';
import { UserModel } from '@/src/modules/users/orm.js';

export default createResolvers({
  AuthorizedUserQuery: {
    me: async ([source]) => source as UserModel,
  },
});
