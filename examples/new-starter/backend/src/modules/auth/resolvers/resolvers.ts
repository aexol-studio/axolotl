import { createResolvers } from '../axolotl.js';
import Query from './Query/resolvers.js';
import Mutation from './Mutation/resolvers.js';

export default createResolvers({
  ...Query,
  ...Mutation,
});
