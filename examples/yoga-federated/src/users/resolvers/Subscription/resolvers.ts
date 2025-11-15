import { createResolvers } from '../../axolotl.js';
import countdown from './countdown.js';

export default createResolvers({
  Subscription: {
    ...countdown.Subscription,
  },
});
