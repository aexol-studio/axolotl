import { FieldResolveInput } from 'stucco-js';
import { Axolotl } from '@aexol/axolotl-core';
import { stuccoAdapter } from '@aexol/axolotl-stucco';
import { Models } from '@/src/models.js';
import { BeerOrm } from '@/src/ormBeersFile.js';

const { applyMiddleware, createResolvers } = Axolotl(stuccoAdapter)<Models>({
  modelsPath: './src/models.ts',
  schemaPath: './schema.graphql',
});

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
