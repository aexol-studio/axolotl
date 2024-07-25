import { createResolvers } from '@/src/modules/users/axolotl.js';

export default createResolvers({
  Query: {
    users: () => ({}),
  },
});
