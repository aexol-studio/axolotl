import { Models } from "@/src/models.js";
import { Axolotl } from "@aexol/axolotl-core";
import { apolloServerAdapter } from "@aexol/axolotl-apollo-server";

const { applyMiddleware, createResolvers } = Axolotl(apolloServerAdapter)<Models>({
    modelsPath: './src/models.ts',
    schemaPath: './schema.graphql',
  });
  
export {applyMiddleware,createResolvers}