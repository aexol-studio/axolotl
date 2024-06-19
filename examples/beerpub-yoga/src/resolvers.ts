import { BeerOrm } from '@/src/ormBeersFile.js';
import { createResolvers } from '@/src/axolotl.js';

const Beer = BeerOrm();
export default createResolvers({
  Query: {
    beers: () => Beer.list(),
  },
  Mutation: {
    addBeer: (input, args) => {
      return Beer.create(args.beer);
    },
    deleteBeer: (input, args) => {
      return Beer.remove(args);
    },
    updateBeer: (input, args) => {
      return Beer.update(args._id, args.beer);
    },
  },
});
