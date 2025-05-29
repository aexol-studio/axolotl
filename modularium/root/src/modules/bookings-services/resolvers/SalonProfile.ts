import { createResolvers } from '@/src/modules/bookings-services/axolotl.js';
import { MongOrb, SalonModel } from '@/src/modules/bookings-services/orm.js';

export default createResolvers({
  SalonProfile: {
    user: async (yoga) => {
      const src = yoga[0] as SalonModel;
      return MongOrb('User').collection.findOne({
        _id: src.user,
      });
    },
    services: async (yoga) => {
      const src = yoga[0] as SalonModel;
      return MongOrb('Service')
        .collection.find({
          salon: src._id,
        })
        .toArray();
    },
  },
});
