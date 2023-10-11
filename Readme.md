# 🦎 Axolotl

This is super alpha version of universal backend( or frontend if you want to create something special) framework ensuring GraphQL Resolvers and arguments type-safety. 

## 🤔 Why? 

Writing GraphQL for backend developers is still complicated when you want to go schema-first instead of code-first.

## 😮 What?

Axolotl is a framework overlord/wrapper to forget about type-casting and looking into schema. With it you can just forget about those 😉

## 🫠 How?

Axolotl provides type-safety and it is up to you to choose an adapter (or write your own). And develop your GraphQL thing super-fast. How it runs it depends what framework you choose under the hood. I am starting with `stucco` adapter which is Golang compiled backend running in TS

### With stucco

```sh
$ npm i @aexol-studio/axolotl-core stucco-js
```

Now you need a `schema.graphql` file or a URL with settings to download the schema from upstream. Out of it Axolotl can generate simple type definitions needed for the library out of your GraphQL Schema.

`models.js` are located where you specify when initiating Axolotl

First execute init command

```sh
$ npx @aexol-studio/axolotl init
```

Then write your index.ts file.

```ts
import { FieldResolveInput } from 'stucco-js';
import { Axolotl } from '@aexol-studio/axolotl-core';
import { stuccoAdapter } from '@aexol-studio/axolotl-stucco';
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

const { applyMiddleware, createResolvers } = Axolotl<Models, FieldResolveInput>({
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

export default async (input: FieldResolveInput) => {
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
  return stuccoAdapter(resolvers)(input);
};

```

## 🧌 Who?

Me [aexol](https://github.com/aexol) is the author of the lib. I was in the type-safety rabbit hole while building [GraphQL Zeus](https://github.com/graphql-editor/graphql-zeus) a GraphQL Client downloaded almost Million of times. While maintaining zeus and developing together with all-the-time changing TypeScript is really hard. I discovered - I can write something simpler - much powerful, that community needs, that integrates with everything - using the same knowledge. Right now you need zeus to run Axolotl, but in short future you won't as type-defs for Axolotl are much much simpler.


## Repository

### Adapters
Place to develop adapters for popular nodejs frameworks.
#### How to write adapter
```ts
import { AxolotlAdapter } from '@aexol-studio/axolotl-core';
```

Just wrap your adapter in AxolotlAdapter function which receives resolvers without type specified

### Examples
Place to experiments with axolotl and its packages

### Local
Packages to support super fast local development

### Federation
Packages to support integration between different schemas. It means that it should be easy set up multiple schemas and runtime for one backend

### To do
- [x] try to implement graphql-yoga adapter as a presentation that listen based frameworks can work with axolotl too
- [] write documentation
- [] implement e2e testing functionality that takes, query, headers, result and runs the test
- [] create command to use npx @aexol-studio/axolotl https://github.com/facebook/create-react-app/blob/main/packages/create-react-app/createReactApp.js here is the good example

## Development

To start developing you need to know few things:
- this is npm workspaces monorepo
- there is sequential build order for command:
```sh
$ npm run build --ws --if-present
```
- to run an example execute:
```sh
$ npm run start -w beerpub
```