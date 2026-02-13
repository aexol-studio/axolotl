import { createResolvers } from '../axolotl.js';
import TodoOps from './TodoOps/resolvers.js';
import AuthorizedUserMutation from './AuthorizedUserMutation/resolvers.js';
import AuthorizedUserQuery from './AuthorizedUserQuery/resolvers.js';
import Subscription from './Subscription/resolvers.js';

export default createResolvers({
  ...TodoOps,
  ...AuthorizedUserMutation,
  ...AuthorizedUserQuery,
  ...Subscription,
});
