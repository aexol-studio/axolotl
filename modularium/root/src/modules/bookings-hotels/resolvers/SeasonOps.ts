import { MongOrb, SeasonModel } from '@/src/modules/bookings-hotels/orm.js';
import { createResolvers } from '@/src/modules/bookings-hotels/axolotl.js';

export const resolvers = createResolvers({
  SeasonOps: {
    delete: async (input) => {
      const src = input[0] as SeasonModel;
      const result = await MongOrb('Season').collection.deleteOne({
        _id: src._id,
      });
      await MongOrb('PricingRule').collection.deleteMany({
        season: src._id,
      });
      return !!result.deletedCount;
    },
    edit: async (input, args) => {
      const src = input[0] as SeasonModel;
      const result = await MongOrb('Season').collection.updateOne(
        {
          _id: src._id,
        },
        {
          $set: {
            ...args.season,
          },
        },
      );
      return !!result.modifiedCount;
    },
  },
});
