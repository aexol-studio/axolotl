import { iGraphQL, MongoModel } from 'i-graphql';
import { ObjectId } from 'mongodb';
import { InviteToken, Team, User, InvitationTeamToken } from '@/src/modules/teams/models.js';

export type OverriddenUsersTeamModel = Omit<MongoModel<Team>, 'members'>;
export type UserModel = User;
export const orm = async () => {
  return iGraphQL<
    {
      TeamCollection: OverriddenUsersTeamModel;
      MemberCollection: MemberModel;
      UserCollection: User;
      InviteTokenCollection: InviteToken;
      UsersInvitationTeamTokenCollection: InvitationTeamToken;
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
export type MemberModel = {
  createdAt: string;
  userId: string;
  teamId: string;
};

export type MemberSource = {
  user: User;
  team: OverriddenUsersTeamModel;
};
