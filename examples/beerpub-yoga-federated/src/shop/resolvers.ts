import { db } from '@/src/db.js';
import { createResolvers } from '@/src/shop/axolotl.js';

export default createResolvers({
  Mutation: {
    setBeerPrice: async (input, args) => {
      return db.update(args._id, {
        price: args.price,
      });
    },
  },
});
