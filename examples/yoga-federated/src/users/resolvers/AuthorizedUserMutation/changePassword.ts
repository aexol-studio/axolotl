import { createResolvers } from '../../axolotl.js';
import { db, UserModel } from '../../db.js';

export default createResolvers({
  AuthorizedUserMutation: {
    changePassword: ([source], { newPassword }) => {
      const src = source as UserModel;
      const index = db.users.findIndex((u) => u._id === src._id);
      const token = Math.random().toString(16);
      db.users.splice(index, 1, {
        ...src,
        password: newPassword,
        token,
      });
      return src;
    },
  },
});
