import { createResolvers } from '@/src/modules/bookings-hotels/axolotl.js';

export const resolvers = createResolvers({
  AuthorizedUserQuery: {
    admin: async ([source]) => {
      return source;
    },
  },
});
