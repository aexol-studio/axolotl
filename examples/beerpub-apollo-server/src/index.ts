import { Axolotl } from '@aexol/axolotl-core';
import { Models } from '@/src/models.js';
import { startStandaloneServer } from '@apollo/server/standalone';
import { apolloServerAdapter } from '@aexol/axolotl-apollo-server';

import { BeerOrm } from '@/src/ormBeersFile.js';

const { applyMiddleware, createResolvers } = Axolotl(apolloServerAdapter)<Models>({
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

// This is yoga specific
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

const {url } = await startStandaloneServer(apolloServerAdapter(resolvers))
console.log(`Server ready at ${url}`);

