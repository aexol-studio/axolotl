import { createResolvers } from '@/src/modules/users/axolotl.js';
import { UsersModule } from '@/src/modules/users/functions/users.js';

export default createResolvers({
  UsersQuery: {
    publicUsers: () => ({}),
    user: async (input) => {
      return UsersModule.mustBeUser(input[2].request.headers.get('Authorization'));
    },
  },
});
