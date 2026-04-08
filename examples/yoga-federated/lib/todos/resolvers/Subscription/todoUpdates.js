import { createSubscriptionHandler } from '@aexol/axolotl-core';
import { createResolvers } from '../../axolotl.js';
import { todoPubSub } from '../../pubsub.js';
export default createResolvers({
    Subscription: {
        todoUpdates: createSubscriptionHandler(async function* (_, { ownerId }) {
            const queue = [];
            let resolve = null;
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
                        const update = queue.shift();
                        yield {
                            type: update.type,
                            todo: update.todo,
                        };
                    }
                    else {
                        await new Promise((r) => {
                            resolve = r;
                        });
                    }
                }
            }
            finally {
                unsubscribe();
            }
        }),
    },
});
//# sourceMappingURL=todoUpdates.js.map