import { createResolvers } from '../../axolotl.js';
import user from './user.js';

export default createResolvers({
  Mutation: {
    ...user.Mutation,
  },
});
