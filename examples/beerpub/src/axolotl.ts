import { Models } from "@/src/models.js";
import { Axolotl } from "@aexol/axolotl-core";
import { stuccoAdapter } from "@aexol/axolotl-stucco";

const { applyMiddleware, createResolvers } = Axolotl(stuccoAdapter)<Models>({
    modelsPath: './src/models.ts',
    schemaPath: './schema.graphql',
  });
  
export { applyMiddleware, createResolvers };