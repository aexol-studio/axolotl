### <img src="https://github.com/user-attachments/assets/5bb137ba-a495-47af-b344-26dbb8b1036b" width=50%> ![Vector 902 (Stroke) (1)](https://github.com/user-attachments/assets/93e38773-7467-4374-a9e8-13387aa5b076)

From the [GraphQL Editor](https://graphqleditor.com/) and [Aexol Studio](http://aexol.com/) teams, comes a pre-alpha version of a universal backend (or frontend if you feel like creating something special) framework that will ensure all your GraphQL resolvers and arguments are type-safe. 

<!-- COLORED AXOLOTL ICON LIBRARY:
![axolotl-white] (https://github.com/user-attachments/assets/ac427bf6-6c02-48d1-bcd2-1e709eeb01d3)
![axolotl-dark-grey] (https://github.com/user-attachments/assets/5dc740b2-ac6d-4011-83dc-51cf1de1029a)
![axolotl-magenta](https://github.com/user-attachments/assets/5cc97a2f-77d8-4db3-98a7-824791fe656d)
![axolotl-lime-green](https://github.com/user-attachments/assets/f96b4aa4-0df6-4fdd-a81c-53dc96983037)
![axolotl-lime](https://github.com/user-attachments/assets/8b4b5523-470e-4988-a5c8-864d593767ba)
![axolotl-lime-2](https://github.com/user-attachments/assets/acfeebad-5c98-41b7-b286-a446dc7332f8)
![axolotl-github-green](https://github.com/user-attachments/assets/e107be1e-1589-4a4e-88d3-11373a277867)
-->

<br />

> [!TIP]
> Check out the *full documentation* and our *Discord channel*:\
> [Full documentation](https://axolotl-docs.vercel.app)\
> [Discord channel](https://discord.gg/f8SfgGBHRz)

<br />

## 😮 What?

Axolotl is a framework overlord/wrapper that lets you forget about type-casting and constantly looking into schemas. When there is no drama, only efficiency remains. 

<br />


Features of Axolotl:
- ⚙️ During development generates models at runtime - ensuring type safety
- 🏃 Enables seamless migration between different GraphQL Servers
- 🤓 Lets you write your own adapters for various purposes
- 🐙 Supports micro-federation!
- 🦕 Supports Deno from version 0.2.7
- 😂 Is very easy to set up, run and integrate


<br />


## 🤔 Why? 

Writing GraphQL is still a complicated process if you want the benefits of taking the schema-first approach instead of just going code-first. I was in a type-safety rabbit hole while building [GraphQL Zeus](https://github.com/graphql-editor/graphql-zeus) (a GraphQL client with almost 1 million downloads) because maintaining and developing with constantly-changing TypeScript proved to be really hard. \
Over the years, I have come to understand that there was even more to it: we needed an **evolutionary** framework. I decided to write something simpler. Something that the community needed that integrated everything using the same knowledge. Something, ultimately, much more powerful.

This is how Axolotl was born.

Do you want to use `apollo-server` but then switch to `graphql-yoga`? No problem. All you have to do is change the adapter.
How about setting up each part of your system in a different GraphQL server with microservices? Done.

Axolotl can do all that and more!

<br />

## 😇 How?

Axolotl provides type-safety and lets you choose the adapter (or write your own). How it runs your GraphQL project depends on the underlying framework you choose. This will let you develop your GraphQL projects quickly and efficiently!

<br />

## Repository


|Element|Description|
|:---|:---| 
| Adapters      | Develop adapters for popular nodejs frameworks | 
| Examples      | Experiment with axolotl and its packages      |
| Local |   Support high-speed local development through the use of packages |
| <br > Micro-federation | Use the micro-federation feature in axolotl <br /> <br /> - Micro-federation means that all the modules are located within one project or one monorepo **or** are distributed as npm packages <br /> - Axolotl projects are merged to the supergraph later|

<br />

## Development

>[!IMPORTANT]
>Before you start developing, here are a few important things to know:

<br />

This project is an npm workspaces monorepo.

<br />

Commands follow a specific build order. To build the project, run:
```sh
 npm run build --ws --if-present
```

<br />


To run an example, execute the following command:
```sh
 npm run start -w beerpub
```
