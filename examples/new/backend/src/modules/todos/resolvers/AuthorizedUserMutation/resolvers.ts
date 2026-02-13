import { createResolvers } from '../../axolotl.js';
import createTodo from './createTodo.js';
import todoOps from './todoOps.js';

export default createResolvers({
  AuthorizedUserMutation: {
    ...createTodo.AuthorizedUserMutation,
    ...todoOps.AuthorizedUserMutation,
  },
});
