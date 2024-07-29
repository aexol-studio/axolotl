import { createResolvers } from '@/src/modules/teams/axolotl.js';
import { UserModel } from '@/src/modules/teams/orm.js';
import { TeamModule } from '@/src/modules/teams/functions/teams.js';

export default createResolvers({
  AuthorizedUserQuery: {
    teams: async ([source]) => {
      const src = source as UserModel;
      return TeamModule.teamsByUser(src._id);
    },
    showTeamInvitations: async ([source], args) => {
      const src = source as UserModel;
      return TeamModule.teamInvitationsByUser({ userId: src._id, status: args.status });
    },
    teamMember: async ([source], args) => {
      const src = source as UserModel;
      const team = await TeamModule.mustBeTeamMember({ userId: src._id, teamId: args._id });
      return {
        team,
        user: src,
      };
    },
  },
});
