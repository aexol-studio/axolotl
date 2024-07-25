import { createResolvers } from '@/src/modules/users/axolotl.js';
import { UsersModule } from '@/src/modules/users/functions/users.js';

export default createResolvers({
  LoginQuery: {
    password: async (input, args) => {
      return UsersModule.passwordLogin({ user: args.user });
    },
    refreshToken: async (input, args) => {
      return UsersModule.refreshToken(args);
    },
    provider: async (input, args) => args,
  },
});
