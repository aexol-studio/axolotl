import { createResolvers } from '../../axolotl.js';
import { User } from '../../models.js';
import { db } from '../../db.js';

export default createResolvers({
  AuthorizedUserMutation: {
    todoOps: async ([source], { _id }) => {
      const src = source as User;
      return db.todos.find((todo) => todo._id === _id && todo.owner === src._id);
    },
  },
});
