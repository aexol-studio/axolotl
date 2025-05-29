import { createResolvers } from '@/src/modules/bookings-services/axolotl.js';
import { commonUserResolver } from '@/src/modules/bookings-services/resolvers/commonResolvers.js';

export default createResolvers({
  Client: {
    user: commonUserResolver,
  },
});
