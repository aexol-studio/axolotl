import { createResolvers } from './axolotl.js';
import { createSubscriptionHandler } from '@aexol/axolotl-core';
import { setTimeout as setTimeout$ } from 'node:timers/promises';

export default createResolvers({
  Query: {
    hello: () => 'Hello, World!',
  },
  Mutation: {
    echo: ([, ,], { message }) => message,
  },
  Subscription: {
    countdown: createSubscriptionHandler(async function* (_, { from }) {
      for (let i = from || 10; i >= 0; i--) {
        await setTimeout$(1000);
        yield i;
      }
    }),
  },
});
