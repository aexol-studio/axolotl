### <img src="https://github.com/user-attachments/assets/5b5de3fa-c50e-4d46-831f-57a7d2599f9a" width=50%> ![Vector 902 (Stroke) (1)](https://github.com/user-attachments/assets/18e2f31f-a70f-4c3e-b284-3b66c989a15f)

From the [GraphQL Editor](https://graphqleditor.com/) and [Aexol Studio](http://aexol.com/) teams, comes a pre-alpha version of a universal backend (or frontend if you feel like creating something special) framework that will ensure GraphQL resolvers and arguments type-safety. 

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
> Check our ***full documentation*** and the ***Discord channel***:\
> [Full documentation](https://axolotl-docs.vercel.app)\
> [Discord channel](https://discord.gg/f8SfgGBHRz)

<br />

## 😮 What?

Axolotl is a framework overlord/wrapper thats lets you forget about type-casting and looking into schemas. When there is no drama, only efficiency remains. 

<br />


Features of Axolotl:
- ⚙️ Generates models at runtime during development - which ensures type safety
- 🏃 Enables seamless migration between different GraphQL Servers
- 🤓 Lets you write your own adapters for various purposes
- 🐙 Supports micro-federation!
- 🦕 Supports Deno from version 0.2.7
- 😂 Is very easy to setup, start and integrate


<br />


## 🤔 Why? 

Writing GraphQL for backend developers remains a complicated process when you want to take the schema-first approach instead of going code-first. I was in the type-safety rabbit hole while building [GraphQL Zeus](https://github.com/graphql-editor/graphql-zeus) (a GraphQL client with almost 1 million downloads). Maintaining Zeus and developing with the constantly-changing TypeScript proved to be really hard. \
Over the years, I have come to understand that there was even more to it: we needed an **evolutionary** framework. I decided to write something simpler. Something that the community needed that integrated everything using the same knowledge. Something, ultimately, much more powerful.

This is how Axolotl was born.

Perhaps you want to use `apollo-server` but then switch to `graphql-yoga`? No problem. All you have to do is change the adapter. 
How about wanting to set up each part of your system in a different GraphQL server with microservices? Done.

<br />

## 🫠 How?

Axolotl provides type-safety and lets you choose the adapter (or write your own). It allows you to develop your GraphQL project quickly and efficiently. How it runs it also depends on the underlying framework you choose. 

<br />

## Repository


|         |            |
| ------------- |-------------| 
| **Adapters**      | To develop adapters for popular nodejs frameworks | 
| **Examples**      | To experiment with axolotl and its packages      |
| **Local** |   To support high-speed local development through the use of packages |
| **Micro-federation** | to use the micro-federation feature in axolotl <br /> <br /> - Micro-federation means that all the modules are located within one project or one monorepo **or** are distributed as npm packages <br /> - The axolotl projects are merged to the supergraph later|

<br />

## Development

>[!TIP]
>To start developing you need to know a few things.

<br />

![arrow-top](https://github.com/user-attachments/assets/3632196c-f2f8-46a2-9d3d-4a8071ca1908#gh-dark-mode-only) ![arrow-top-dark](https://github.com/user-attachments/assets/496077a7-85a9-44dc-8770-5a248d63886d#gh-light-mode-only)
This is an npm workspaces monorepo.

<br />

![arrow-top](https://github.com/user-attachments/assets/3632196c-f2f8-46a2-9d3d-4a8071ca1908#gh-dark-mode-only) ![arrow-top-dark](https://github.com/user-attachments/assets/496077a7-85a9-44dc-8770-5a248d63886d#gh-light-mode-only)
There is a sequential build order for commands as seen below:
```sh
 npm run build --ws --if-present
```

<br />

![arrow-top](https://github.com/user-attachments/assets/3632196c-f2f8-46a2-9d3d-4a8071ca1908#gh-dark-mode-only) ![arrow-top-dark](https://github.com/user-attachments/assets/496077a7-85a9-44dc-8770-5a248d63886d#gh-light-mode-only)
To run an example execute you need to type in:
```sh
 npm run start -w beerpub
```
