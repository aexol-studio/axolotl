import { createResolvers } from '@/src/modules/teams/axolotl.js';
import { MongoOrb, OverriddenUsersTeamModel } from '@/src/modules/teams/orm.js';

export default createResolvers({
  Team: {
    members: async ([source]) => {
      const src = source as OverriddenUsersTeamModel;
      return MongoOrb('MemberCollection')
        .collection.find({
          teamId: src._id,
        })
        .toArray();
    },
    owner: async ([source]) => {
      const src = source as OverriddenUsersTeamModel;
      return MongoOrb('UserCollection').collection.findOne({
        _id: src.owner,
      });
    },
  },
});
