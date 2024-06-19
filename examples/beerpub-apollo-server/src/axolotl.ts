import { Models } from "@/src/models.js";
import { Axolotl } from "@aexol/axolotl-core";
import { apolloServerAdapter } from "@aexol/axolotl-apollo-server";

export const { applyMiddleware, createResolvers, adapter } = Axolotl(apolloServerAdapter)<Models>({
    modelsPath: './src/models.ts',
    schemaPath: './schema.graphql',
});
  