import { Axolotl } from '@aexol-studio/axolotl-core';
import { Models } from '@/src/models.js';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { YogaInitialContext } from 'graphql-yoga';
import { graphqlYogaAdapter } from '@aexol-studio/axolotl-graphql-yoga';

const { applyMiddleware, createResolvers } = Axolotl<Models, [any, any, YogaInitialContext]>({
  modelsPath: './src/models.ts',
  schemaPath: './schema.graphql',
});

const beerFilePath = path.join(process.cwd(), 'beers.json');

const beers: Array<{
  name: string;
  price: number;
  _id: string;
  createdAt: string;
}> = JSON.parse(readFileSync(beerFilePath, 'utf-8'));

const resolvers = createResolvers({
  Query: {
    beers: (input, args) => beers,
  },
  Mutation: {
    addBeer: (input, args) => {
      const beerId = Math.random().toString(8);
      beers.push({
        _id: beerId,
        createdAt: new Date().toISOString(),
        ...args.beer,
      });
      writeFileSync(beerFilePath, JSON.stringify(beers));
      return beerId;
    },
    deleteBeer: (input, args) => {
      const deletedIndex = beers.findIndex((b) => b._id === args._id);
      beers.splice(deletedIndex, 1);
      writeFileSync(beerFilePath, JSON.stringify(beers));
      return true;
    },
    updateBeer: (input, args) => {
      const updatedIndex = beers.findIndex((b) => b._id === args._id);
      beers[updatedIndex] = {
        ...beers[updatedIndex],
        ...args.beer,
      };
      writeFileSync(beerFilePath, JSON.stringify(beers));
      return true;
    },
  },
});

applyMiddleware(
  resolvers,
  [
    (input) => {
      console.log('DUPA');
      return input;
    },
  ],
  { Query: { beers: true } },
);

graphqlYogaAdapter(resolvers as any).listen(4000, () => {
  console.log('LISTENING');
});
