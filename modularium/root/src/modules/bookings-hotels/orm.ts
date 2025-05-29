import { iGraphQL, MongoModel } from 'i-graphql';
import { ObjectId } from 'mongodb';
import { House, HouseAddon, PricingRule, Reservation, Season, User } from '@/src/modules/bookings-hotels/models.js';

type OwnedByUser<T> = T & { owner: string };

export type HouseModel = MongoModel<House>;
export type HouseAddonModel = OwnedByUser<MongoModel<HouseAddon>>;
export type UserModel = MongoModel<User> & { emailConfirmed?: boolean };
export type SeasonModel = OwnedByUser<Season>;
export type PricingRuleModel = OwnedByUser<MongoModel<PricingRule>>;
export type ReservationModel = OwnedByUser<MongoModel<Reservation>>;

export type UserAuthModel = {
  _id: string;
  username: string;
  salt: string;
  passwordHash: string;
  authorizationToken: string;
  userId: string;
};

const orm = async () => {
  return iGraphQL<
    {
      UserCollection: UserModel;
      UserAuthorizationCollection: UserAuthModel;
      Season: SeasonModel;
      PricingRule: PricingRuleModel;
      Reservation: ReservationModel;
      House: HouseModel;
      HouseAddon: HouseAddonModel;
    },
    {
      _id: () => string;
    }
  >({
    autoFields: {
      _id: () => new ObjectId().toHexString(),
    },
  });
};

export const MongOrb = await orm();
