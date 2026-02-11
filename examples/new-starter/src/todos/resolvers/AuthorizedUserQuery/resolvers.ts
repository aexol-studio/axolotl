import { createResolvers } from '../../axolotl.js';
import todos from './todos.js';
import todo from './todo.js';

export default createResolvers({
  AuthorizedUserQuery: {
    ...todos.AuthorizedUserQuery,
    ...todo.AuthorizedUserQuery,
  },
});
