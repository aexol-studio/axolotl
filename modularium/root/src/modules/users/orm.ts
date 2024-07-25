import { iGraphQL, MongoModel } from 'i-graphql';
import { ObjectId } from 'mongodb';
import { User } from '@/src/models.js';

export type UserModel = Omit<User, 'teams'>;

export const orm = async () => {
  return iGraphQL<
    {
      UserCollection: UserModel;
      UserAuthorizationCollection: UserAuthModel;
      RefreshTokenCollection: RefreshTokenModel;
      SocialCollection: SocialModel;
    },
    {
      _id: () => string;
      createdAt: () => string;
    }
  >({
    autoFields: {
      _id: () => new ObjectId().toHexString(),
      createdAt: () => new Date().toISOString(),
    },
  });
};

export const MongoOrb = await orm();

export type UserAuthModel = {
  _id: string;
  userId: string;
  salt?: string;
  passwordHash?: string;
  authorizationToken?: string;
  resetPasswordToken?: string;
  createdAt?: string;
  username?: string;
};

export type RefreshTokenModel = MongoModel<{
  _id: string;
  userId: string;
}>;

export type SocialModel = {
  _id: string;
  socialId: string;
  userId: string;
  createdAt?: string | undefined;
};
