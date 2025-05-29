import { MongOrb, ReservationModel } from '@/src/modules/bookings-hotels/orm.js';
import { createResolvers } from '@/src/modules/bookings-hotels/axolotl.js';

export const resolvers = createResolvers({
  Reservation: {
    house: async (input) => {
      const src = input[0] as ReservationModel;
      const house = await MongOrb('House').collection.findOne({ _id: src.house });
      return house;
    },
  },
});
