import { Axolotl } from 'npm:@aexol/axolotl-core@^0.5.4';
import graphqlYogaDenoAdapter from 'jsr:@aexol/axolotl-deno-yoga@^0.1.3';

import { Models } from './models.ts';

export const { applyMiddleware, createResolvers, adapter } = Axolotl(graphqlYogaDenoAdapter)<Models>();
