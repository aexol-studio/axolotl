import { HouseModel, MongOrb } from '@/src/modules/bookings-hotels/orm.js';
import { createResolvers } from '@/src/modules/bookings-hotels/axolotl.js';

export const resolvers = createResolvers({
  House: {
    addons: async ([source]) => {
      const src = source as HouseModel;
      if (!src.addons?.length) return null;
      return MongOrb('HouseAddon')
        .collection.find({ _id: { $in: src.addons } })
        .toArray();
    },
  },
});
