import { createResolvers } from '@/src/modules/users/axolotl.js';
import { UsersModule } from '@/src/modules/users/functions/users.js';
import { UserModel } from '@/src/modules/users/orm.js';

export default createResolvers({
  AuthorizedUserMutation: {
    changePasswordWhenLogged: async ([source], args) => {
      const src = source as UserModel;
      return UsersModule.changePasswordWhenLogged({
        user: {
          ...args.changePasswordData,
          userId: src._id,
        },
      });
    },
    editUser: async ([source], args) => {
      const src = source as UserModel;
      return UsersModule.editUser({
        userId: src._id,
        update: args.updatedUser,
      });
    },
    deleteAccount: async ([source], _) => {
      const src = source as UserModel;
      return UsersModule.deleteAccount(src);
    },
    integrateSocialAccount: async ([source], args) => {
      const src = source as UserModel;
      return UsersModule.integrateSocialAccount({
        currentUser: src,
        socialUser: args.userData,
      });
    },
  },
});
