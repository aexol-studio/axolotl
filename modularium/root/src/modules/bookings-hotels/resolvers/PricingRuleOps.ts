import { MongOrb, PricingRuleModel } from '@/src/modules/bookings-hotels/orm.js';
import { createResolvers } from '@/src/modules/bookings-hotels/axolotl.js';

export const resolvers = createResolvers({
  PricingRuleOps: {
    delete: async (input) => {
      const src = input[0] as PricingRuleModel;
      const result = await MongOrb('PricingRule').collection.deleteOne({
        _id: src._id,
      });
      return !!result.deletedCount;
    },
    update: async (input, args) => {
      const src = input[0] as PricingRuleModel;
      const result = await MongOrb('PricingRule').collection.updateOne(
        {
          _id: src._id,
        },
        {
          $set: {
            ...args.pricingRule,
          },
        },
      );
      return !!result.modifiedCount;
    },
  },
});
