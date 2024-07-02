# 🦎 Axolotl

This is super alpha version of universal backend( or frontend if you want to create something special) framework ensuring GraphQL Resolvers and arguments type-safety. 

[Full documentation](https://axolotl-docs.vercel.app)
[Discord channel](https://discord.gg/f8SfgGBHRz)

## 🤔 Why? 

Writing GraphQL for backend developers is still complicated when you want to go schema-first instead of code-first. Moreover I felt like we need an **evolutionary** framework. 

For example using `apollo-server` but want to switch to `graphql-yoga` ? No problem just change an adapter. 

Want to experiment with `stucco-js` with Go lang core? No problem change the adapter. 

Want to set up every part of your system in different graphql server with microservices?. No problem.

## 😮 What?

Axolotl is a framework overlord/wrapper to forget about type-casting and looking into schema. With it you can just forget about those 😉
- ⚙️ models generate runtime on dev providing type safety
- 🏃 migrate between different GraphQL Servers
- 🧐 write your own adapters for different purposes
- 😂 easy to setup,start and integrate
- 🫡 from GraphQL Editor and Aexol teams
- 🪦 No RIP we will maintain forever
- 🦕 Deno support from 0.2.7

## 🫠 How?

Axolotl provides type-safety and it is up to you to choose an adapter (or write your own). And develop your GraphQL thing super-fast. How it runs it depends what framework you choose under the hood. 

### With stucco

```sh
 npm i @aexol/axolotl-core @aexol/axolotl-graphql-yoga
```

Now you need a `schema.graphql` file or a URL with settings to download the schema from upstream. Out of it Axolotl can generate simple type definitions needed for the library out of your GraphQL Schema.

`models.js` are located where you specify when initiating Axolotl

First execute init command

```sh
 npx @aexol/axolotl init
```

Then write your index.ts file.

```ts
import { FieldResolveInput } from 'stucco-js';
import { Axolotl } from '@aexol/axolotl-core';
import { stuccoAdapter } from '@aexol/axolotl-stucco';
import { Models } from '@/src/models.js';
import { BeerOrm } from '@/src/ormBeersFile.js';

// choose your adapter
const { applyMiddleware, createResolvers } = Axolotl(stuccoAdapter)<Models>();

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
// scroll down for the second part of the file
```
And choose an adapter. Base idea is that code should run with every GraphQL Server available in nodejs.

### I choose graphql-yoga
```ts
//This you should add on the top

// And change the Axolotl import to yoga specific

const { applyMiddleware, createResolvers } = Axolotl(graphqlYogaAdapter)<Models>();

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

graphqlYogaAdapter(resolvers).listen(4000, () => {
  console.log('LISTENING');
});
```

## 🧌 Who?

Me [aexol](https://github.com/aexol) is the author of the lib. I was in the type-safety rabbit hole while building [GraphQL Zeus](https://github.com/graphql-editor/graphql-zeus) a GraphQL Client downloaded almost Million of times. While maintaining zeus and developing together with all-the-time changing TypeScript is really hard. I discovered - I can write something simpler - much powerful, that community needs, that integrates with everything - using the same knowledge.


## Repository

### Adapters
Place to develop adapters for popular nodejs frameworks.

### Examples
Place to experiments with axolotl and its packages

### Local
Packages to support super fast local development

### Federation
Packages to support integration between different schemas. It means that it should be easy set up multiple schemas and runtime for one backend

### To do
- [x] try to implement graphql-yoga adapter as a presentation that listen based frameworks can work with axolotl too
- [x] write documentation
- [ ] implement e2e testing functionality that takes, query, headers, result and runs the test
- [x] create command to use npx @aexol/axolotl https://github.com/facebook/create-react-app/blob/main/packages/create-react-app/createReactApp.js here is the good example
- [ ] add schema generation to ts file from URL 

## Development

To start developing you need to know few things:
- this is npm workspaces monorepo
- there is sequential build order for command:
```sh
 npm run build --ws --if-present
```
- to run an example execute:
```sh
 npm run start -w beerpub
```