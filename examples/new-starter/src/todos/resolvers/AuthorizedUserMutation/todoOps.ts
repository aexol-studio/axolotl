import { createResolvers } from '../../axolotl.js';
import { User } from '../../models.js';
import { prisma } from '@/src/db.js';

export default createResolvers({
  AuthorizedUserMutation: {
    todoOps: async ([source], { _id }) => {
      const src = source as User;
      const todo = await prisma.todo.findFirst({
        where: { id: _id, ownerId: src._id },
      });
      return todo ? { _id: todo.id, content: todo.content, done: todo.done } : undefined;
    },
  },
});
