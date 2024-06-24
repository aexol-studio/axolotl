import { Axolotl } from 'npm:@aexol/axolotl-core';
import graphqlYogaDenoAdapter from 'jsr:@aexol/axolotl-deno-yoga';

import { Models } from './models.ts';

export const { applyMiddleware, createResolvers, adapter } = Axolotl(graphqlYogaDenoAdapter)<Models>();
