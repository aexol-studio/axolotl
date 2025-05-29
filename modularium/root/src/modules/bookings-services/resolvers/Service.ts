import { createResolvers } from '@/src/modules/bookings-services/axolotl.js';
import { MongOrb, ServiceModel } from '@/src/modules/bookings-services/orm.js';

export default createResolvers({
  Service: {
    salon: async (yoga) => {
      const src = yoga[0] as ServiceModel;
      return MongOrb('Salon').collection.findOne({
        _id: src.salon,
      });
    },
  },
});
