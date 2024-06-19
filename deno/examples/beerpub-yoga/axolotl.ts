import { Axolotl } from 'npm:@aexol/axolotl-core';
import graphqlYogaDenoAdapter from 'jsr:@aexol/axolotl-deno-yoga';

import { Models } from './models.ts';

const { applyMiddleware, createResolvers } = Axolotl(graphqlYogaDenoAdapter)<Models>({
  modelsPath: './src/models.ts',
  schemaPath: './schema.graphql',
});

export { applyMiddleware, createResolvers };
