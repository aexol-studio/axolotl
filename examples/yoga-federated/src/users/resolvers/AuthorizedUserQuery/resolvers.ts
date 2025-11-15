import { createResolvers } from '../../axolotl.js';
import me from './me.js';

export default createResolvers({
  AuthorizedUserQuery: {
    ...me.AuthorizedUserQuery,
  },
});
