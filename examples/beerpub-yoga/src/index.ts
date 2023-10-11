import { FieldResolveInput } from 'stucco-js';
import { Axolotl } from '@aexol-studio/axolotl-core';
import { stuccoAdapter, updateStuccoJson } from '@aexol-studio/axolotl-stucco';
import { Models } from '@/src/models.js';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { createSchema, createYoga } from 'graphql-yoga';

const yoga = () => {
  const schema = createSchema({
    typeDefs: '',
    resolvers: {},
  });
};

const beerFilePath = path.join(process.cwd(), 'beers.json');
const beers: Array<{
  name: string;
  price: number;
  _id: string;
  createdAt: string;
}> = JSON.parse(readFileSync(beerFilePath, 'utf-8'));

const { applyMiddleware, sendResponse, serve, createResolvers } = Axolotl<Models, FieldResolveInput>({
  adapter: stuccoAdapter,
  resolverGenerators: [updateStuccoJson],
  modelsPath: './src/models.ts',
  schemaPath: './schema.graphql',
});

const resolvers = createResolvers({
  Query: {
    beers: () => beers,
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

export default serve(async (input) => {
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
  return sendResponse(input, resolvers);
});
