import { createResolvers } from '../axolotl.js';
import Mutation from './Mutation/resolvers.js';
import Query from './Query/resolvers.js';
import AuthorizedUserMutation from './AuthorizedUserMutation/resolvers.js';
import AuthorizedUserQuery from './AuthorizedUserQuery/resolvers.js';
import Subscription from './Subscription/resolvers.js';

export default createResolvers({
  ...Mutation,
  ...Query,
  ...AuthorizedUserMutation,
  ...AuthorizedUserQuery,
  ...Subscription,
});
