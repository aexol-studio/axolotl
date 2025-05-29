import { createResolvers } from '@/src/modules/bookings-hotels/axolotl.js';

export const resolvers = createResolvers({
  AuthorizedUserMutation: {
    admin: async ([source]) => {
      return source;
    },
  },
});
