import { createResolvers } from '../../axolotl.js';
import createNote from './createNote.js';
import deleteNote from './deleteNote.js';

export default createResolvers({
  AuthorizedUserMutation: {
    ...createNote.AuthorizedUserMutation,
    ...deleteNote.AuthorizedUserMutation,
  },
});
