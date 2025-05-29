import { MongOrb, UserModel } from '@/src/modules/bookings-hotels/orm.js';
import { createResolvers } from '@/src/modules/bookings-hotels/axolotl.js';

export const resolvers = createResolvers({
  AdminQuery: {
    houses: async ([source]) => {
      const src = source as UserModel;
      return MongOrb('House').collection.find({ owner: src._id }).toArray();
    },
    houseById: async ([source], args) => {
      const src = source as UserModel;
      return MongOrb('House').collection.findOne({ owner: src._id, _id: args._id });
    },
    addons: async ([source]) => {
      const src = source as UserModel;
      return MongOrb('HouseAddon').collection.find({ owner: src._id }).toArray();
    },
    me: async (input) => {
      const userSource = input[0] as UserModel;
      return userSource;
    },
    pricingRules: async ([source]) => {
      const src = source as UserModel;
      const rules = await MongOrb('PricingRule')
        .collection.find({
          owner: src._id,
        })
        .toArray();
      return rules;
    },
    reservations: async ([source]) => {
      const src = source as UserModel;
      return MongOrb('Reservation')
        .collection.find({
          owner: src._id,
        })
        .toArray();
    },
    seasons: async ([source]) => {
      const src = source as UserModel;
      return MongOrb('Season')
        .collection.find({
          owner: src._id,
        })
        .toArray();
    },
  },
});
