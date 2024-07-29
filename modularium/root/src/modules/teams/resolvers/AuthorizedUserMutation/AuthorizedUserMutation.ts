import { createResolvers } from '@/src/modules/teams/axolotl.js';
import { TeamModule } from '@/src/modules/teams/functions/teams.js';
import { MemberSource, UserModel } from '@/src/modules/teams/orm.js';
import { CreateTeamResponse } from '@/src/modules/teams/models.js';

export default createResolvers({
  AuthorizedUserMutation: {
    createTeam: async ([source], args) => {
      const src = source as UserModel;
      const result = await TeamModule.createTeam({ ownerId: src._id, teamName: args.teamName });
      return result satisfies CreateTeamResponse;
    },
    joinToTeam: async ([source], args) => {
      const src = source as UserModel;
      const result = await TeamModule.joinToTeam({
        ...args,
        userId: src._id,
      });
      return result;
    },
    joinToTeamWithInvitationToken: async ([source], args) => {
      const src = source as UserModel;
      const result = await TeamModule.joinToTeamWithInvitationToken({
        ...args,
        userId: src._id,
      });
      return result;
    },
    teamMember: async ([source], args) => {
      const src = source as UserModel;
      const team = await TeamModule.mustBeTeamMember({ userId: src._id, teamId: args._id });
      return {
        team,
        user: src,
      } satisfies MemberSource;
    },
  },
});
