# <img src="https://github.com/user-attachments/assets/ac427bf6-6c02-48d1-bcd2-1e709eeb01d3" width="40"> AXOLOTL

Brought to you by the GraphQL Editor and the hard-working Aexol teams ([Editor homepage](https://github.com/graphql-editor)), comes a pre-alpha version of a universal backend (or frontend if you feel like creating something special) framework that will ensure GraphQL resolvers and arguments type-safety. 

<br /><!--STRONA WIZUALNA: przerwa na potrzeby wizualnego oddzielenia podpisu pod tytułem/wstępu od dalszej treści i podrozdziałów-->

> [!TIP]
> Check our ***full documentation*** and the ***Discord channel*** below:

[Full documentation](https://axolotl-docs.vercel.app)

[Discord channel](https://discord.gg/f8SfgGBHRz)

<br /><!--STRONA WIZUALNA: przerwa na potrzeby wizualnego oddzielenia podpisu pod tytułem/wstępu od dalszej treści i podrozdziałów-->

## 😮 What?

Axolotl is a framework overlord/wrapper thats lets you forget about type-casting and looking into schemas. When there is no drama, only efficiency remains. 

Features of Axolotl:
- ⚙️ Generates models at runtime during development - which ensures type safety
- 🏃 Enables seamless migration between different GraphQL Servers
- 🤓 Lets you write your own adapters for various purposes
- 🐙 Supports micro-federation!
- 🦕 Supports Deno from version 0.2.7
- 😂 Is very easy to setup, start and integrate


<br /><!--STRONA WIZUALNA: przerwa na potrzeby wizualnego oddzielenia podpisu pod tytułem/wstępu od dalszej treści i podrozdziałów-->


## 🤔 Why? 

Writing GraphQL for backend developers remains a complicated process when you want to take the schema-first approach instead of code-first one. Over the years, I've come to understand that there was more to it: we needed an **evolutionary** framework. 

This is how Axolotl was created.

For example, maybe you want to use `apollo-server` but then prefer to switch to `graphql-yoga`? No problem. All you have to do is change the adapter. 
How about wanting to set up each part of your system in a different graphql server with microservices? Done.

<br /><!--STRONA WIZUALNA: przerwa na potrzeby wizualnego oddzielenia podpisu pod tytułem/wstępu od dalszej treści i podrozdziałów-->

## 🫠 How?

Axolotl provides type-safety and it is up to you to choose an adapter (or write your own). And develop your GraphQL thing super-fast. How it runs it depends what framework you choose under the hood. 

<br /><!--STRONA WIZUALNA: przerwa na potrzeby wizualnego oddzielenia podpisu pod tytułem/wstępu od dalszej treści i podrozdziałów-->

## 🧌 Who?

Me [aexol](https://github.com/aexol) is the author of the lib. I was in the type-safety rabbit hole while building [GraphQL Zeus](https://github.com/graphql-editor/graphql-zeus) a GraphQL Client downloaded almost Million of times. While maintaining zeus and developing together with all-the-time changing TypeScript is really hard. I discovered - I can write something simpler - much powerful, that community needs, that integrates with everything - using the same knowledge.

<br /><!--STRONA WIZUALNA: przerwa na potrzeby wizualnego oddzielenia podpisu pod tytułem/wstępu od dalszej treści i podrozdziałów-->

## Repository

### Adapters
Place to develop adapters for popular nodejs frameworks.

### Examples
Place to experiments with axolotl and its packages

### Local
Packages to support super fast local development

### Micro Federation
You can use micro federation feature in axolotl. Micro federation means all the modules are located within one project or one monorepo or are distributed as npm packages. Those axolotl projects are merged to the supergraph later. 

<br /><!--STRONA WIZUALNA: przerwa na potrzeby wizualnego oddzielenia podpisu pod tytułem/wstępu od dalszej treści i podrozdziałów-->

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
