import { createResolvers } from '../../axolotl.js';
import { Todo } from '../../models.js';
import { prisma } from '@/src/db.js';

export default createResolvers({
  TodoOps: {
    markDone: async ([source]) => {
      const src = source as Todo;
      const todo = await prisma.todo.findUnique({
        where: { id: src._id },
      });
      if (!todo || todo.done) return false;
      await prisma.todo.update({
        where: { id: src._id },
        data: { done: true },
      });
      return true;
    },
  },
});
