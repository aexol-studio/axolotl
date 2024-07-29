import { createResolvers } from '@/src/modules/teams/axolotl.js';
import { MemberModel, MongoOrb } from '@/src/modules/teams/orm.js';

export default createResolvers({
  TeamMember: {
    team: async ([source]) => {
      const src = source as MemberModel;
      return MongoOrb('TeamCollection').collection.findOne({
        _id: src.teamId,
      });
    },
    user: async ([source]) => {
      const src = source as MemberModel;
      return MongoOrb('UserCollection').collection.findOne({
        _id: src.userId,
      });
    },
  },
});
