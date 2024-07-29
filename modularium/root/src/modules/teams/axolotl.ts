import { Models } from '@/src/modules/teams/models.js';
import { Axolotl } from '@aexol/axolotl-core';
import { graphqlYogaAdapter } from '@aexol/axolotl-graphql-yoga';

export const { applyMiddleware, createResolvers, createDirectives, adapter } = Axolotl(graphqlYogaAdapter)<
  Models,
  unknown
>();
