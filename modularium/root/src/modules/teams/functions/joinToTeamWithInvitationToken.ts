import { JoinToTeamWithInvitationTokenError } from '@/src/modules/teams/models.js';
import { MongoOrb } from '@/src/modules/teams/orm.js';

export const joinToTeamWithInvitationToken = async ({ token, userId }: { token: string; userId: string }) => {
  const inviteToken = await MongoOrb('InviteTokenCollection').collection.findOne({
    token,
  });
  if (!inviteToken) {
    return { hasError: JoinToTeamWithInvitationTokenError.INVITATION_TOKEN_NOT_FOUND };
  }
  if (!inviteToken.teamId) {
    return { hasError: JoinToTeamWithInvitationTokenError.TEAM_IN_INVITATION_TOKEN_NOT_SPECIFIED };
  }

  const existingMember = await MongoOrb('MemberCollection').collection.findOne({
    teamId: inviteToken.teamId,
    userId,
  });
  if (existingMember) {
    return { hasError: JoinToTeamWithInvitationTokenError.MEMBER_ALREADY_EXISTS_IN_THE_TEAM };
  }
  const timestamp = parseInt(inviteToken.expires);
  const expirationDate = new Date(timestamp);
  const currentDate = new Date();
  if (currentDate.getTime() > expirationDate.getTime()) {
    return { hasError: JoinToTeamWithInvitationTokenError.INVITATION_TOKEN_EXPIRED };
  }
  await MongoOrb('MemberCollection').createWithAutoFields('createdAt')({ teamId: inviteToken.teamId, userId });
  return {
    result: true,
  };
};
