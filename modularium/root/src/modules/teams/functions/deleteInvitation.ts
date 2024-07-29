import { MongoOrb } from '@/src/modules/teams/orm.js';

export const deleteInvitation = async ({ _id, teamId }: { _id: string; teamId: string }) => {
  const res1 = await MongoOrb('UsersInvitationTeamTokenCollection').collection.deleteOne({
    _id,
    teamId,
  });
  const res =
    res1.deletedCount === 1 ? res1 : await MongoOrb('InviteTokenCollection').collection.deleteOne({ _id, teamId });
  return res.deletedCount === 1;
};
