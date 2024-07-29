import { MongoOrb } from '@/src/modules/teams/orm.js';

export const mustBeTeamMember = async ({ userId, teamId }: { userId: string; teamId: string }) => {
  const member = await MongoOrb('MemberCollection').collection.findOne({
    teamId,
    userId,
  });
  if (!member) throw new Error('USER_IS_NOT_A_TEAM_MEMBER');
  const team = await MongoOrb('TeamCollection').collection.findOne({ _id: teamId });
  if (!team) throw new Error('Team no longer exists');
  return team;
};
