import { createResolvers } from '../../axolotl.js';
import { TodoModel, db } from '../../db.js';

export default createResolvers({
  TodoOps: {
    markDone: async ([source]) => {
      const src = source as TodoModel;
      const index = db.todos.findIndex((todo) => todo._id === src._id);
      db.todos.splice(index, 1, {
        ...src,
        done: true,
      });
      // check if the state changed
      return src.done !== true;
    },
  },
});
