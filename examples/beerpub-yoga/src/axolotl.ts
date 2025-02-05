import { Directives, Models, Scalars } from '@/src/models.js';
import { Axolotl } from '@aexol/axolotl-core';
import { graphqlYogaWithContextAdapter } from '@aexol/axolotl-graphql-yoga';

export const { applyMiddleware, createResolvers, createDirectives, adapter, createScalars } = Axolotl(
  graphqlYogaWithContextAdapter<{ isActive?: boolean }>(),
)<Models, Scalars, Directives>();
