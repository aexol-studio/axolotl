# 🦎 Axolotl

This is super alpha version of universal backend( or frontend if you want to create something special) framework ensuring GraphQL Resolvers and arguments type-safety. 

[Full documentation](https://axolotl-docs.vercel.app)
[Discord channel](https://discord.gg/f8SfgGBHRz)

## 🤔 Why? 

Writing GraphQL for backend developers is still complicated when you want to go schema-first instead of code-first. Moreover I felt like we need an **evolutionary** framework. 

For example using `apollo-server` but want to switch to `graphql-yoga` ? No problem just change an adapter. 
Want to set up every part of your system in different graphql server with microservices?. No problem.

## 😮 What?

Axolotl is a framework overlord/wrapper to forget about type-casting and looking into schema. With it you can just forget about those 😉
- ⚙️ models generate runtime on dev providing type safety
- 🏃 migrate between different GraphQL Servers
- 🧐 write your own adapters for different purposes
- 😂 easy to setup,start and integrate
- 🫡 from GraphQL Editor and Aexol teams
- 🪦 No RIP we will maintain forever
- 🐙 Micro federation!
- 🦕 Deno support from 0.2.7

## 🫠 How?

Axolotl provides type-safety and it is up to you to choose an adapter (or write your own). And develop your GraphQL thing super-fast. How it runs it depends what framework you choose under the hood. 

## 🧌 Who?

Me [aexol](https://github.com/aexol) is the author of the lib. I was in the type-safety rabbit hole while building [GraphQL Zeus](https://github.com/graphql-editor/graphql-zeus) a GraphQL Client downloaded almost Million of times. While maintaining zeus and developing together with all-the-time changing TypeScript is really hard. I discovered - I can write something simpler - much powerful, that community needs, that integrates with everything - using the same knowledge.


## Repository

### Adapters
Place to develop adapters for popular nodejs frameworks.

### Examples
Place to experiments with axolotl and its packages

### Local
Packages to support super fast local development

### Micro Federation
You can use micro federation feature in axolotl. Micro federation means all the modules are located within one project or one monorepo or are distributed as npm packages. Those axolotl projects are merged to the supergraph later. 

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