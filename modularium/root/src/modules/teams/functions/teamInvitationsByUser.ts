import { InvitationTeamStatus } from '@/src/modules/teams/models.js';
import { MongoOrb } from '@/src/modules/teams/orm.js';

export const teamInvitationsByUser = async ({ userId, status }: { userId: string; status?: InvitationTeamStatus }) => {
  return MongoOrb('UsersInvitationTeamTokenCollection')
    .collection.find({
      recipient: userId,
      status,
    })
    .toArray();
};
