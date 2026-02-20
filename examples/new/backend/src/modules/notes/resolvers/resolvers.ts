import { createResolvers } from '../axolotl.js';
import AuthorizedUserMutation from './AuthorizedUserMutation/resolvers.js';
import AuthorizedUserQuery from './AuthorizedUserQuery/resolvers.js';

export default createResolvers({
  ...AuthorizedUserMutation,
  ...AuthorizedUserQuery,
});
