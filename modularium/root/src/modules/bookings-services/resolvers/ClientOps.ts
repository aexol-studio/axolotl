import { createResolvers } from '@/src/modules/bookings-services/axolotl.js';
import { RegistrationError } from '@/src/modules/bookings-services/models.js';
import { ClientModel, MongOrb } from '@/src/modules/bookings-services/orm.js';
import { GraphQLError } from 'graphql';

export default createResolvers({
  ClientOps: {
    update: async (yoga, args) => {
      const src = yoga[0] as ClientModel;
      if (args.client.email || args.client.phone) {
        const exists = await MongOrb('Client').collection.findOne({
          $or: [
            {
              phone: args.client.phone,
            },
            {
              email: args.client.email,
            },
          ],
        });
        if (exists) {
          if (exists._id !== src._id) return [RegistrationError.EXISTS_WITH_SAME_NAME];
        }
      }
      await MongOrb('Client').collection.updateOne(
        { _id: src._id },
        {
          $set: {
            ...args.client,
          },
        },
      );
    },
    salonClientOps: async (yoga, args) => {
      const src = yoga[0] as ClientModel;
      return MongOrb('SalonClient').collection.findOne({
        _id: args._id,
        client: src._id,
      });
    },
    registerToSalon: async (yoga, args) => {
      const src = yoga[0] as ClientModel;
      const Salon = await MongOrb('Salon').collection.findOne({
        slug: args.salonSlug,
      });
      if (!Salon) throw new GraphQLError('Salon with the following slug does not exist');

      const exists = await MongOrb('SalonClient').collection.findOne({
        salon: Salon._id,
        client: src._id,
      });
      if (exists) {
        throw new GraphQLError('This client already exist in this salon');
      }
      const result = await MongOrb('SalonClient').createWithAutoFields(
        '_id',
        'updatedAt',
        'createdAt',
      )({
        client: src._id,
        salon: Salon._id,
        visits: [],
      });
      return !!result.insertedId;
    },
  },
});
