import { createResolvers } from '../../axolotl.js';
import changePassword from './changePassword.js';
import deleteAccount from './deleteAccount.js';
import revokeSession from './revokeSession.js';
import revokeAllSessions from './revokeAllSessions.js';

export default createResolvers({
  AuthorizedUserMutation: {
    ...changePassword.AuthorizedUserMutation,
    ...deleteAccount.AuthorizedUserMutation,
    ...revokeSession.AuthorizedUserMutation,
    ...revokeAllSessions.AuthorizedUserMutation,
  },
});
