import { createResolvers } from '../../axolotl.js';
import me from './me.js';
import sessions from './sessions.js';

export default createResolvers({
  AuthorizedUserQuery: {
    ...me.AuthorizedUserQuery,
    ...sessions.AuthorizedUserQuery,
  },
});
