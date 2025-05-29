import { MongOrb, ReservationModel } from '@/src/modules/bookings-hotels/orm.js';
import { createResolvers } from '@/src/modules/bookings-hotels/axolotl.js';
import { ReservationStatus } from '@/src/modules/bookings-hotels/models.js';

export const resolvers = createResolvers({
  ReservationOps: {
    delete: async (input) => {
      const src = input[0] as ReservationModel;
      const result = await MongOrb('Reservation').collection.deleteOne({
        _id: src._id,
      });
      return !!result.deletedCount;
    },
    update: async (input, args) => {
      const src = input[0] as ReservationModel;
      const result = await MongOrb('Reservation').collection.updateOne(
        {
          _id: src._id,
        },
        {
          $set: {
            ...args.reservation,
            status: args.reservation.status ? (args.reservation.status as unknown as ReservationStatus) : undefined,
          },
        },
      );
      return !!result.modifiedCount;
    },
  },
});
