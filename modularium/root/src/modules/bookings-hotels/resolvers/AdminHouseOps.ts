import { createResolvers } from '@/src/modules/bookings-hotels/axolotl.js';
import { HouseModel, MongOrb } from '@/src/modules/bookings-hotels/orm.js';

export const resolvers = createResolvers({
  AdminHouseOps: {
    delete: async (input) => {
      const houseSource = input[0] as HouseModel;
      const result = await MongOrb('House').collection.deleteOne({ _id: houseSource._id });
      return !!result.deletedCount;
    },
    update: async (input, args) => {
      const houseSource = input[0] as HouseModel;
      const result = await MongOrb('House').collection.updateOne(
        { _id: houseSource._id },
        {
          $set: {
            ...args.house,
          },
        },
      );
      return !!result.modifiedCount;
    },
    createPricingRule: async (input, args) => {
      const houseSource = input[0] as HouseModel;
      const pricingRule = await MongOrb('PricingRule').createWithAutoFields('_id')({
        house: houseSource._id,
        owner: houseSource.owner,
        ...args.pricingRule,
      });
      return pricingRule.insertedId;
    },
    pricingRuleOps: async (input, args) => {
      const houseSource = input[0] as HouseModel;
      return MongOrb('PricingRule').collection.findOne({
        house: houseSource._id,
        _id: args._id,
      });
    },
  },
});
