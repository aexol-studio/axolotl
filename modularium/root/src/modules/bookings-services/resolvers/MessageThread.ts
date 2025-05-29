import { createResolvers } from '@/src/modules/bookings-services/axolotl.js';
import { MessageThreadModel, MongOrb } from '@/src/modules/bookings-services/orm.js';

export default createResolvers({
  MessageThread: {
    salonClient: (yoga) => {
      const src = yoga[0] as MessageThreadModel;
      return MongOrb('SalonClient').collection.findOne({
        _id: src.salonClient,
      });
    },
    messages: (yoga) => {
      const src = yoga[0] as MessageThreadModel;
      return MongOrb('Message')
        .collection.find({
          messageThread: src._id,
        })
        .toArray();
    },
  },
});
