import { createResolvers } from '@/src/modules/teams/axolotl.js';
import { TeamModule } from '@/src/modules/teams/functions/teams.js';
import { MemberSource, MongoOrb } from '@/src/modules/teams/orm.js';
import crypto from 'node:crypto';

export default createResolvers({
  TeamMemberMutation: {
    generateInviteToken: async ([source], { tokenOptions: { expires, domain, name } }) => {
      const { user, team } = source as MemberSource;
      return TeamModule.generateInviteToken({
        domain,
        userId: user._id,
        expires,
        name,
        teamId: team._id,
      });
    },
    removeUserFromTeam: async ([source], args) => {
      const src = source as MemberSource;
      return TeamModule.removeUserFromTeam({
        currentUserId: src.user._id,
        teamId: src.team._id,
        userId: args.data.userId,
      });
    },
    deleteInviteToken: async ([source], args) => {
      const src = source as MemberSource;
      return TeamModule.deleteInvitation({
        teamId: src.team._id,
        _id: args.id,
      });
    },
  },
});
export const isUserOwnerOfTeam = async (userId: string, team: string) =>
  (await MongoOrb('TeamCollection').collection.findOne({ owner: userId, name: team })) ? true : false;
export const genRandomString = (length: number) =>
  crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
