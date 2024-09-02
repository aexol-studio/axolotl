### <img src="/docs/public/axolotl-logo.png" width=50%> ![Vector 902 (Stroke) (1)](/docs/public/axolotl-stroke.png)

From the [GraphQL Editor](https://graphqleditor.com/) and [Aexol Studio](http://aexol.com/) teams, comes a Framework ensuring **GraphQL** Resolvers and arguments **type-safety**. Written in TypeScript.

<br />

> [!TIP]
> Check our *full documentation* and the *Discord channel*:\
> [Full documentation](https://axolotl-docs.vercel.app)\
> [Discord channel](https://discord.gg/f8SfgGBHRz)

<br />

## 😮 Features

Axolotl is a framework overlord/wrapper thats lets you forget about type-casting and looking into schemas. When there is no drama, only efficiency remains. 

<br />

- ⚙️ Generates models at runtime during development - which ensures type safety
- 🏃 Enables seamless migration between different GraphQL Servers like GraphQL Yoga and Apollo Server
- 🤓 Lets you write your own adapters for various purposes
- 🐙 Supports micro-federation! It allows to merge different schemas and resolvers inside one repository.
- 🦕 Supports Deno from version 0.2.7. It works with Deno in production.
- 😂 Is very easy to setup, start and integrate. You just need to `npx @aexol/axololtl create-yoga`
- 🦎 includes modularium, a package with installable GraphQL schemas with backend


<br />


## 🤔 Story

Writing GraphQL for backend developers remains a complicated process when you want to take the schema-first approach instead of going code-first. I was in the type-safety rabbit hole while building [GraphQL Zeus](https://github.com/graphql-editor/graphql-zeus) (a GraphQL client with almost 1 million downloads). Maintaining Zeus and developing with the constantly-changing TypeScript proved to be really hard. \
Over the years, I have come to understand that there was even more to it: we needed an **evolutionary** framework. I decided to write something simpler. Something that the community needed that integrated everything using the same knowledge. Something, ultimately, much more powerful.

This is how Axolotl was born.

<br />

## 😇 How?

Axolotl provides type-safety and lets you choose the adapter (or write your own). It allows you to develop your GraphQL project quickly and efficiently. How it runs it also depends on the underlying framework you choose. 

<br />

## Repository


|Element|Description|
|:---|:---| 
| Adapters      | To develop adapters for popular nodejs frameworks | 
| Examples      | To experiment with axolotl and its packages      |
| Modularium      | Installable code chunks for your project      |
| <br > Micro-federation | To use the micro-federation feature in axolotl <br /> <br /> - Micro-federation means that all the modules are located within one project or one monorepo **or** are distributed as npm packages <br /> - The axolotl projects are merged to the supergraph later|

<br />

## Development

>[!IMPORTANT]
>To start developing you need to know a few things.

<br />

This is an npm workspaces monorepo.

<br />

There is a sequential build order for commands as seen below:
```sh
 npm run build --ws --if-present
```

<br />


To run an example execute you need to type in:
```sh
 npm run start -w beerpub
```
