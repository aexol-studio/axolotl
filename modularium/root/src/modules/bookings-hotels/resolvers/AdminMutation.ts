import { MongOrb, UserModel } from '@/src/modules/bookings-hotels/orm.js';
import { createResolvers } from '@/src/modules/bookings-hotels/axolotl.js';

export const resolvers = createResolvers({
  AdminMutation: {
    createHouse: async (input, args) => {
      const src = input[0] as UserModel;
      const result = await MongOrb('House').createWithAutoFields('_id')({
        ...args.house,
        owner: src._id,
      });
      return result.insertedId;
    },
    createHouseAddon: async (input, args) => {
      const src = input[0] as UserModel;
      const result = await MongOrb('HouseAddon').createWithAutoFields('_id')({
        ...args.addon,
        owner: src._id,
      });
      return result.insertedId;
    },
    createSeason: async (input, args) => {
      const src = input[0] as UserModel;
      const result = await MongOrb('Season').createWithAutoFields('_id')({
        ...args.season,
        owner: src._id,
      });
      return result.insertedId;
    },
    houseOps: async (input, args) =>
      MongOrb('House').collection.findOne({
        _id: args._id,
      }),
    addonOps: async (input, args) =>
      MongOrb('HouseAddon').collection.findOne({
        _id: args._id,
      }),
    seasonOps: async (input, args) =>
      MongOrb('Season').collection.findOne({
        _id: args._id,
      }),
    reservationOps: async (input, args) =>
      MongOrb('Reservation').collection.findOne({
        _id: args._id,
      }),
  },
});
