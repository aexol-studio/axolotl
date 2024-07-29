import { MongoOrb } from '@/src/modules/teams/orm.js';
import { RemoveUserFromTeamError } from '@/src/modules/teams/models.js';

export const removeUserFromTeam = async ({
  userId,
  teamId,
  currentUserId,
}: {
  userId: string;
  teamId: string;
  currentUserId: string;
}) => {
  const team = await MongoOrb('TeamCollection').collection.findOne({ owner: currentUserId, _id: teamId });
  if (!team) {
    return { hasError: RemoveUserFromTeamError.YOU_ARE_NOT_THE_OWNER_OF_A_TEAM_OR_TEAM_DOES_NOT_EXIST };
  }
  if (currentUserId == userId) {
    return { hasError: RemoveUserFromTeamError.YOU_CANNOT_KICK_YOURSELF_FROM_THE_TEAM };
  }
  await MongoOrb('MemberCollection').collection.deleteOne({
    teamId,
    userId,
  });
  return { result: true };
};
