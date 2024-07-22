import { createResolvers } from '@/src/beers/axolotl.js';
import { db } from '@/src/db.js';

export default createResolvers({
  Query: {
    beers: () => db.list(),
  },
  Mutation: {
    addBeer: (input, args) => {
      return db.create(args.beer);
    },
    deleteBeer: (input, args) => {
      return db.remove(args);
    },
    updateBeer: (input, args) => {
      return db.update(args._id, args.beer);
    },
  },
});
