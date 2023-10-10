# 🐾 Jenot

This is super alpha version of universal backend( or frontend if you want to create something special) framework ensuring GraphQL Resolvers and arguments type-safety. 

## 🤔 Why? 
Writing GraphQL for backend developers is still complicated when you want to go schema-first instead of code-first.

## 😮 What?

SaintGraal is a framework overlord/wrapper to forget about type-casting and looking into schema. With it you can just forget about those 😉

## 🫠 How?

SaintGraal provides type-safety and it is up to you to choose an adapter (or write your own). And develop your GraphQL thing super-fast. How it runs it depends what framework you choose under the hood. I am starting with `stucco` adapter which is Golang compiled backend running in TS

```sh
$ npm i @jenot/core stucco-js
```

Now you need a `schema.graphql` file or a URL with settings to download the schema from upstream. Out of it SaintGraal can generate simple type definitions needed for the library out of your GraphQL Schema.

```ts
import { FieldResolveInput } from 'stucco-js';
import { Jenot } from '@jenot/core';
import { stuccoAdapter, updateStuccoJson } from '@jenot/stucco';
import { Models } from '@/src/models.js';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
const beerFilePath = path.join(process.cwd(), 'beers.json');
const beers: Array<{
  name: string;
  price: number;
  _id: string;
  createdAt: string;
}> = JSON.parse(readFileSync(beerFilePath, 'utf-8'));

const { applyMiddleware, sendResponse, serve, createResolvers } = Jenot<Models, FieldResolveInput>({
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

```

## 🧌 Who?

Me [aexol](https://github.com/aexol) is the author of the lib. I was in the type-safety rabbit hole while building [GraphQL Zeus](https://github.com/graphql-editor/graphql-zeus) a GraphQL Client downloaded almost Million of times. While maintaining zeus and developing together with all-the-time changing TypeScript is really hard. I discovered - I can write something simpler - much powerful, that community needs, that integrates with everything - using the same knowledge. Right now you need zeus to run SaintGraal, but in short future you won't as type-defs for SaintGraal are much much simpler.
