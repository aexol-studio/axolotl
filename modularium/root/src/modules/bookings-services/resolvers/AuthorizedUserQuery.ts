import { createResolvers } from '@/src/modules/bookings-services/axolotl.js';
import {
  commonClientResolver,
  commonSalonResolver,
} from '@/src/modules/bookings-services/resolvers/commonResolvers.js';

export default createResolvers({
  AuthorizedUserQuery: {
    client: commonClientResolver,
    salon: commonSalonResolver,
  },
});
