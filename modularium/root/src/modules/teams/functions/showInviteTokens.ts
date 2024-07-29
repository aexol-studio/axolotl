import { MongoOrb } from '@/src/modules/teams/orm.js';

export const showInviteTokens = (teamId: string) => {
  return MongoOrb('InviteTokenCollection').collection.find({ teamId }).toArray();
};
