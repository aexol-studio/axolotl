import { Models } from "@/src/models.js";
import { Axolotl } from "@aexol/axolotl-core";
import { stuccoAdapter } from "@aexol/axolotl-stucco";

export const { applyMiddleware, createResolvers, adapter } = Axolotl(stuccoAdapter)<Models,{}>();
  