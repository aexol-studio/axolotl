import { HouseAddonModel, MongOrb } from '@/src/modules/bookings-hotels/orm.js';
import { createResolvers } from '@/src/modules/bookings-hotels/axolotl.js';

export const resolvers = createResolvers({
  HouseAddonOps: {
    delete: async (input) => {
      const src = input[0] as HouseAddonModel;
      const result = await MongOrb('HouseAddon').collection.deleteOne({
        _id: src._id,
      });
      return !!result.deletedCount;
    },
    update: async (input, args) => {
      const src = input[0] as HouseAddonModel;
      const result = await MongOrb('HouseAddon').collection.updateOne(
        {
          _id: src._id,
        },
        {
          $set: {
            ...args.addon,
          },
        },
      );
      return !!result.modifiedCount;
    },
  },
});
