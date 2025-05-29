import { User } from '@/src/models.js';
import {
  Client,
  Message,
  MessageThread,
  SalonClient,
  SalonProfile,
  Service,
  Visit,
} from '@/src/modules/bookings-services/models.js';
import { iGraphQL, MongoModel } from 'i-graphql';
import { ObjectId } from 'mongodb';

export type UserModel = MongoModel<User>;

export type SalonModel = Omit<MongoModel<SalonProfile>, 'services'>;
export type SalonClientModel = Omit<MongoModel<SalonClient>, 'messageThread'>;
export type ClientModel = MongoModel<Client>;
export type VisitModel = MongoModel<Visit>;
export type ServiceModel = MongoModel<Service>;
export type MessageThreadModel = MongoModel<MessageThread>;
export type MessageModel = MongoModel<Message>;

export const orm = async () => {
  return iGraphQL<
    {
      User: UserModel;
      Salon: SalonModel;
      SalonClient: SalonClientModel;
      Client: ClientModel;
      Visit: VisitModel;
      Service: ServiceModel;
      Message: MessageModel;
      MessageThread: MessageThreadModel;
    },
    {
      _id: () => string;
      createdAt: () => string;
      updatedAt: () => string;
    }
  >({
    autoFields: {
      _id: () => new ObjectId().toHexString(),
      createdAt: () => new Date().toISOString(),
      updatedAt: () => new Date().toISOString(),
    },
  });
};

export const MongOrb = await orm();
