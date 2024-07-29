import { CreateTeamError } from '@/src/modules/teams/models.js';
import { MongoOrb } from '@/src/modules/teams/orm.js';

export const createTeam = async ({ ownerId, teamName }: { ownerId: string; teamName: string }) => {
  if (await MongoOrb('TeamCollection').collection.findOne({ name: teamName }))
    return { hasError: CreateTeamError.TEAM_NOT_CREATED };
  const createdTeam = await MongoOrb('TeamCollection').createWithAutoFields(
    '_id',
    'createdAt',
  )({
    owner: ownerId,
    name: teamName,
  });
  await MongoOrb('MemberCollection').createWithAutoFields('createdAt')({
    teamId: createdTeam.insertedId,
    userId: ownerId,
  });
  if (!createdTeam.insertedId) return { hasError: CreateTeamError.TEAM_NOT_CREATED };
  return { result: createdTeam.insertedId };
};
