import { createResolvers } from '../../axolotl.js';
import changePassword from './changePassword.js';

export default createResolvers({
  AuthorizedUserMutation: {
    ...changePassword.AuthorizedUserMutation,
  },
});
