import { createResolvers } from '../../axolotl.js';
import countdown from './countdown.js';
import aiChat from './aiChat.js';

export default createResolvers({
  Subscription: {
    ...countdown.Subscription,
    ...aiChat.Subscription,
  },
});
