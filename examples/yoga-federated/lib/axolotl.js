import { Axolotl } from '@aexol/axolotl-core';
import { graphqlYogaAdapter } from '@aexol/axolotl-graphql-yoga';
export const { applyMiddleware, createResolvers, createDirectives, adapter } = Axolotl(graphqlYogaAdapter)();
//# sourceMappingURL=axolotl.js.map