import { createResolvers } from '../../axolotl.js';
import { User } from '../../models.js';
import { db } from '../../db.js';

export default createResolvers({
  AuthorizedUserQuery: {
    todos: async ([source]) => {
      const src = source as User;
      return db.todos.filter((todo) => todo.owner === src._id);
    },
  },
});
