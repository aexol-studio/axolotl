import { createResolvers } from '@/src/modules/teams/axolotl.js';
import AuthorizedUserMutation from '@/src/modules/teams/resolvers/AuthorizedUserMutation/AuthorizedUserMutation.js';
import AuthorizedUserQuery from '@/src/modules/teams/resolvers/AuthorizedUserQuery/AuthorizedUserQuery.js';
import Team from '@/src/modules/teams/resolvers/Team/Team.js';
import TeamMember from '@/src/modules/teams/resolvers/TeamMember/TeamMember.js';
import TeamMemberMutation from '@/src/modules/teams/resolvers/TeamMemberMutation/TeamMemberMutation.js';
import TeamMemberQuery from '@/src/modules/teams/resolvers/TeamMemberQuery/TeamMemberQuery.js';

export default createResolvers({
  ...Team,
  ...TeamMember,
  ...TeamMemberMutation,
  ...TeamMemberQuery,
  ...AuthorizedUserMutation,
  ...AuthorizedUserQuery,
});
