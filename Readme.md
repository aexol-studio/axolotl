### <img src="https://github.com/user-attachments/assets/ac427bf6-6c02-48d1-bcd2-1e709eeb01d3#gh-dark-mode-only" width=4%> <img src="https://github.com/user-attachments/assets/5dc740b2-ac6d-4011-83dc-51cf1de1029a#gh-light-mode-only" width=4%> AXOLOTL ![Vector 902 (Stroke) (1)](https://github.com/user-attachments/assets/18e2f31f-a70f-4c3e-b284-3b66c989a15f)




Brought to you by the [GraphQL Editor](https://graphqleditor.com/) and [Aexol Studio](http://aexol.com/) teams, comes a pre-alpha version of a universal backend (or frontend if you feel like creating something special) framework that will ensure GraphQL resolvers and arguments type-safety. 

<br /><!--STRONA WIZUALNA: przerwa na potrzeby wizualnego oddzielenia podpisu pod tytułem/wstępu od dalszej treści i podrozdziałów-->

> [!TIP]
> Check our ***full documentation*** and the ***Discord channel*** below:

[Full documentation](https://axolotl-docs.vercel.app)

[Discord channel](https://discord.gg/f8SfgGBHRz)

<br /><!--STRONA WIZUALNA: przerwa na potrzeby wizualnego oddzielenia podpisu pod tytułem/wstępu od dalszej treści i podrozdziałów-->

## 😮 What?

Axolotl is a framework overlord/wrapper thats lets you forget about type-casting and looking into schemas. When there is no drama, only efficiency remains. 

<br /><!--STRONA WIZUALNA: przerwa na potrzeby wizualnego oddzielenia podpisu pod tytułem/wstępu od dalszej treści i podrozdziałów-->


<ins>Features of Axolotl: </ins>
- ⚙️ Generates models at runtime during development - which ensures type safety
- 🏃 Enables seamless migration between different GraphQL Servers
- 🤓 Lets you write your own adapters for various purposes
- 🐙 Supports micro-federation!
- 🦕 Supports Deno from version 0.2.7
- 😂 Is very easy to setup, start and integrate


<br /><!--STRONA WIZUALNA: przerwa na potrzeby wizualnego oddzielenia podpisu pod tytułem/wstępu od dalszej treści i podrozdziałów-->


## 🤔 Why? 

Writing GraphQL for backend developers remains a complicated process when you want to take the schema-first approach instead of going code-first. I was in the type-safety rabbit hole while building [GraphQL Zeus](https://github.com/graphql-editor/graphql-zeus) (a GraphQL Client with almost 1 Million downloads). Maintaining Zeus and developing with the constantly-changing TypeScript proved to be really hard. Over the years, I have come to understand that there was even more to it: we needed an **evolutionary** framework. I decided to write something simpler. Something that the community needed that integrated everything using the same knowledge. Something, ultimately, much more powerful.

This is how Axolotl was born.

For example, maybe you want to use `apollo-server` but then prefer to switch to `graphql-yoga`? No problem. All you have to do is change the adapter. 
How about wanting to set up each part of your system in a different GraphQL server with microservices? Done.

<br /><!--STRONA WIZUALNA: przerwa na potrzeby wizualnego oddzielenia podpisu pod tytułem/wstępu od dalszej treści i podrozdziałów-->

## 🫠 How?

Axolotl provides type-safety and lets you choose the adapter (or write your own). It allows you to develop your GraphQL project quickly and efficiently. How it runs it also depends on the underlying framework you choose. 

<br /><!--STRONA WIZUALNA: przerwa na potrzeby wizualnego oddzielenia podpisu pod tytułem/wstępu od dalszej treści i podrozdziałów-->

## Repository

### Adapters 
![arrow-top](https://github.com/user-attachments/assets/3632196c-f2f8-46a2-9d3d-4a8071ca1908#gh-dark-mode-only) ![arrow-top-dark](https://github.com/user-attachments/assets/496077a7-85a9-44dc-8770-5a248d63886d#gh-light-mode-only) to develop adapters for popular nodejs frameworks


### Examples 
![arrow-top](https://github.com/user-attachments/assets/3632196c-f2f8-46a2-9d3d-4a8071ca1908#gh-dark-mode-only) ![arrow-top-dark](https://github.com/user-attachments/assets/496077a7-85a9-44dc-8770-5a248d63886d#gh-light-mode-only) to experiment with axolotl and its packages

### Local 
![arrow-top](https://github.com/user-attachments/assets/3632196c-f2f8-46a2-9d3d-4a8071ca1908#gh-dark-mode-only) ![arrow-top-dark](https://github.com/user-attachments/assets/496077a7-85a9-44dc-8770-5a248d63886d#gh-light-mode-only) to support high-speed local development through the use of packages

### Micro Federation 
![arrow-top](https://github.com/user-attachments/assets/3632196c-f2f8-46a2-9d3d-4a8071ca1908#gh-dark-mode-only) ![arrow-top-dark](https://github.com/user-attachments/assets/496077a7-85a9-44dc-8770-5a248d63886d#gh-light-mode-only)
to use the micro federation feature in axolotl; micro federation means all the modules are located within one project or one monorepo **or** are distributed as npm packages. The axolotl projects are merged to the supergraph later

<br /><!--STRONA WIZUALNA: przerwa na potrzeby wizualnego oddzielenia podpisu pod tytułem/wstępu od dalszej treści i podrozdziałów-->

## Development

>[!IMPORTANT]
>To start developing you need to know a few things:

<br />

![arrow-top](https://github.com/user-attachments/assets/3632196c-f2f8-46a2-9d3d-4a8071ca1908#gh-dark-mode-only) ![arrow-top-dark](https://github.com/user-attachments/assets/496077a7-85a9-44dc-8770-5a248d63886d#gh-light-mode-only)
this is an npm workspaces monorepo

<br />

![arrow-top](https://github.com/user-attachments/assets/3632196c-f2f8-46a2-9d3d-4a8071ca1908#gh-dark-mode-only) ![arrow-top-dark](https://github.com/user-attachments/assets/496077a7-85a9-44dc-8770-5a248d63886d#gh-light-mode-only)
there is a sequential build order for commands as seen below:
```sh
 npm run build --ws --if-present
```

<br />

![arrow-top](https://github.com/user-attachments/assets/3632196c-f2f8-46a2-9d3d-4a8071ca1908#gh-dark-mode-only) ![arrow-top-dark](https://github.com/user-attachments/assets/496077a7-85a9-44dc-8770-5a248d63886d#gh-light-mode-only)
to run an example execute you need to type in:
```sh
 npm run start -w beerpub
```
