import { InvitationTeamStatus, JoinToTeamError } from '@/src/modules/teams/models.js';
import { MongoOrb } from '@/src/modules/teams/orm.js';

export const joinToTeam = async ({ teamId, userId }: { teamId: string; userId: string }) => {
  const invitation = await MongoOrb('UsersInvitationTeamTokenCollection').collection.findOne({
    teamId,
    recipient: userId,
    status: InvitationTeamStatus.Waiting,
  });
  if (!invitation) {
    return { hasError: JoinToTeamError.TEAM_INVITATION_DOES_NOT_EXIST_OR_CAPTURED };
  }
  const existingMember = await MongoOrb('MemberCollection').collection.findOne({
    teamId,
    userId,
  });
  if (existingMember) {
    return { hasError: JoinToTeamError.MEMBER_ALREADY_EXISTS_IN_THE_TEAM };
  }
  await Promise.all([
    MongoOrb('UsersInvitationTeamTokenCollection').collection.updateOne(
      { teamId, recipient: userId },
      { $set: { status: InvitationTeamStatus.Taken } },
    ),
    MongoOrb('MemberCollection').createWithAutoFields('createdAt')({ teamId, userId }),
  ]);
  return {
    result: true,
  };
};
