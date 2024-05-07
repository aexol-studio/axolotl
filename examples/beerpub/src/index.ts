import { FieldResolveInput } from 'stucco-js';
import { stuccoAdapter } from '@aexol/axolotl-stucco';
import { BeerOrm } from '@/src/ormBeersFile.js';
import { applyMiddleware, createResolvers } from '@/src/axolotl.js';


const Beer = BeerOrm();

const resolvers = createResolvers({
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

// This is stucco specific
export default async (input: FieldResolveInput) => {
  applyMiddleware(
    resolvers,
    [
      (input) => {
        console.log('Hello from Middleware I run only on Query.beers');
        return input;
      },
    ],
    { Query: { beers: true } },
  );
  return stuccoAdapter(resolvers)(input);
};
