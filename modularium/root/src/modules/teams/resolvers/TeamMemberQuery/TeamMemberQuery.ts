import { createResolvers } from '@/src/modules/teams/axolotl.js';
import { TeamModule } from '@/src/modules/teams/functions/teams.js';
import { MemberSource } from '@/src/modules/teams/orm.js';
import { Filter } from 'mongodb';
import { InviteToken } from '../../models.js';
export default createResolvers({
  TeamMemberQuery: {
    showInviteTokens: async ([source]) => {
      const src = source as MemberSource;
      return TeamModule.showInviteTokens(src.team._id);
    },
    showTeamInvitations: async ([source], { status }) => {
      const src = source as MemberSource;
      const query: Filter<InviteToken> = {};

      if (status) {
        query.status = { $eq: status };
      }

      return TeamModule.teamInvitationsByTeam({ ...query, teamId: src.team._id });
    },
    team: async ([source]) => {
      const src = source as MemberSource;
      return src.team;
    },
  },
});
