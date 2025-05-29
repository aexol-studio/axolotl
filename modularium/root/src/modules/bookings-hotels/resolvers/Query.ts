import { MongOrb } from '@/src/modules/bookings-hotels/orm.js';
import { createResolvers } from '@/src/modules/bookings-hotels/axolotl.js';

export const resolvers = createResolvers({
  Query: {
    houses: async () => {
      return MongOrb('House').collection.find({}).toArray();
    },
    housePublic: async (input, args) => {
      return MongOrb('House').collection.findOne({ _id: args.id });
    },
  },
});
