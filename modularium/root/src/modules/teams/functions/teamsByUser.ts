import { MongoOrb } from '@/src/modules/teams/orm.js';

export const teamsByUser = async (userId: string) => {
  const memberOf = await MongoOrb('MemberCollection')
    .collection.find({
      userId,
    })
    .toArray();
  return MongoOrb('TeamCollection')
    .collection.find({
      _id: {
        $in: memberOf.map((m) => m.teamId),
      },
    })
    .toArray();
};
