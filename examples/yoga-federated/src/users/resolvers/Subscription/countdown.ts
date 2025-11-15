import { createSubscriptionHandler } from '@aexol/axolotl-core';
import { createResolvers } from '../../axolotl.js';
import { setTimeout as setTimeout$ } from 'node:timers/promises';

export default createResolvers({
  Subscription: {
    countdown: createSubscriptionHandler(async function* (source, { from }) {
      for (let i = from; i >= 0; i--) {
        await setTimeout$(1000);
        yield i;
      }
    }),
  },
});
