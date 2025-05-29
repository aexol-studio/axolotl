import { MongOrb, UserModel } from '@/src/modules/bookings-services/orm.js';
import { GraphQLError } from 'graphql';
import { YogaInitialContext } from 'graphql-yoga';

export const commonUserResolver = async (yoga: [unknown, unknown, YogaInitialContext]) => {
  const src = yoga[0] as { user: string };
  return MongOrb('User').collection.findOne({
    _id: src.user,
  });
};

export const commonClientResolver = async (yoga: [unknown, unknown, YogaInitialContext]) => {
  const user = yoga[0] as UserModel;
  const client = await MongOrb('Client').collection.findOne({
    user: user._id,
  });
  if (!client) throw new GraphQLError('Forbidden!. Register as a Client');
  return client;
};

export const commonSalonResolver = async (yoga: [unknown, unknown, YogaInitialContext]) => {
  const user = yoga[0] as UserModel;
  const salon = await MongOrb('Salon').collection.findOne({
    user: user._id,
  });
  if (!salon) throw new GraphQLError('Forbidden!. Register as a Client');
  return salon;
};
