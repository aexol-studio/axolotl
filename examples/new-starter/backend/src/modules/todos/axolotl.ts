import { Models } from '@/src/modules/todos/models.js';
import { Axolotl } from '@aexol/axolotl-core';
import { graphqlYogaWithContextAdapter } from '@aexol/axolotl-graphql-yoga';
import { AppContext } from '@/src/lib/context.js';

const yogaAdapter = graphqlYogaWithContextAdapter<AppContext>((initial) => initial as AppContext);

export const { applyMiddleware, createResolvers, createDirectives, adapter } = Axolotl(yogaAdapter)<
  Models<{ Secret: number; ID: string }>,
  unknown
>();
