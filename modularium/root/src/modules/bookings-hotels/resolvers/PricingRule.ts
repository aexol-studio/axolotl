import { MongOrb, PricingRuleModel } from '@/src/modules/bookings-hotels/orm.js';
import { createResolvers } from '@/src/modules/bookings-hotels/axolotl.js';

export const resolvers = createResolvers({
  PricingRule: {
    season: async (input) => {
      const src = input[0] as PricingRuleModel;
      return MongOrb('Season').collection.findOne({ _id: src.season });
    },
    house: async (input) => {
      const src = input[0] as PricingRuleModel;
      const house = await MongOrb('House').collection.findOne({ _id: src.house });
      return house;
    },
  },
});
