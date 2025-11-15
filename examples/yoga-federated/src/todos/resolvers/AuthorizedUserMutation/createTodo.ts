import { createResolvers } from '../../axolotl.js';
import { User } from '../../models.js';
import { db } from '../../db.js';

export default createResolvers({
  AuthorizedUserMutation: {
    createTodo: async ([source], { content }) => {
      const src = source as User;
      const _id = Math.random().toString(8);
      db.todos.push({ owner: src._id, content, _id });
      return _id;
    },
  },
});
