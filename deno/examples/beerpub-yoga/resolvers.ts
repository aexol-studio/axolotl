import { createResolvers } from './axolotl.ts';
import { BeerOrm } from './ormBeersFile.ts';

const Beer = BeerOrm();
const resolvers = createResolvers({
  Query: {
    beers: () => Beer.list(),
  },
  Mutation: {
    addBeer: (_, args) => {
      return Beer.create(args.beer);
    },
    deleteBeer: (_, args) => {
      return Beer.remove(args);
    },
    updateBeer: (_, args) => {
      return Beer.update(args._id, args.beer);
    },
  },
});

export default resolvers;
