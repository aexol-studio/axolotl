import { InvitationTeamStatus } from '@/src/modules/teams/models.js';
import { MongoOrb } from '@/src/modules/teams/orm.js';

export const teamInvitationsByTeam = async ({ teamId, status }: { teamId: string; status?: InvitationTeamStatus }) => {
  return MongoOrb('UsersInvitationTeamTokenCollection')
    .collection.find({
      teamId,
      status,
    })
    .toArray();
};
