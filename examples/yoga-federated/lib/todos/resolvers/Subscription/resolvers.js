import { createResolvers } from '../../axolotl.js';
import todoUpdates from './todoUpdates.js';
export default createResolvers({
    Subscription: {
        ...todoUpdates.Subscription,
    },
});
//# sourceMappingURL=resolvers.js.map