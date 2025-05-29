import { MongOrb } from '@/src/modules/bookings-hotels/orm.js';
import { createResolvers } from '@/src/modules/bookings-hotels/axolotl.js';

export const resolvers = createResolvers({
  Mutation: {
    createPaymentSession: async () => {
      //some stripe
    },
    housePublic: async (input, args) => {
      return MongOrb('House').collection.findOne({ _id: args.id });
    },
  },
});
