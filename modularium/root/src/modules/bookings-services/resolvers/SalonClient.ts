import { createResolvers } from '@/src/modules/bookings-services/axolotl.js';
import { MongOrb, SalonClientModel } from '@/src/modules/bookings-services/orm.js';

export default createResolvers({
  SalonClient: {
    client: async (yoga) => {
      const src = yoga[0] as SalonClientModel;
      return MongOrb('Client').collection.findOne({
        _id: src.client,
      });
    },
    salon: async (yoga) => {
      const src = yoga[0] as SalonClientModel;
      return MongOrb('Salon').collection.findOne({
        _id: src.salon,
      });
    },
    visits: async (yoga) => {
      const src = yoga[0] as SalonClientModel;
      return MongOrb('Visit')
        .collection.find({
          client: src.client,
        })
        .toArray();
    },
    messageThread: async (yoga) => {
      const src = yoga[0] as SalonClientModel;
      return MongOrb('MessageThread').collection.findOne({
        salonClient: src._id,
      });
    },
  },
});
