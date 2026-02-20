import { createResolvers } from '../../axolotl.js';
import notes from './notes.js';
import note from './note.js';

export default createResolvers({
  AuthorizedUserQuery: {
    ...notes.AuthorizedUserQuery,
    ...note.AuthorizedUserQuery,
  },
});
