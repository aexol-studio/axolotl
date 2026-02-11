import { createSubscriptionHandler } from '@aexol/axolotl-core';
import { createResolvers } from '../../axolotl.js';
import { todoPubSub, TodoUpdate } from '../../pubsub.js';

export default createResolvers({
  Subscription: {
    todoUpdates: createSubscriptionHandler(async function* (_, { ownerId }) {
      const queue: TodoUpdate[] = [];
      let resolve: (() => void) | null = null;

      const unsubscribe = todoPubSub.subscribe(ownerId, (update) => {
        queue.push(update);
        if (resolve) {
          resolve();
          resolve = null;
        }
      });

      try {
        while (true) {
          if (queue.length > 0) {
            const update = queue.shift()!;
            yield {
              type: update.type,
              todo: update.todo,
            };
          } else {
            await new Promise<void>((r) => {
              resolve = r;
            });
          }
        }
      } finally {
        unsubscribe();
      }
    }),
  },
});
