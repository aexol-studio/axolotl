import { createResolvers } from '../../axolotl.js';
import { prisma } from '@/src/db.js';

export default createResolvers({
  AuthorizedUserMutation: {
    todoOps: async ([, , context], { _id }) => {
      const todo = await prisma.todo.findFirst({
        where: { id: _id, ownerId: context.authUser!._id },
      });
      return todo ? { _id: todo.id, content: todo.content, done: todo.done } : undefined;
    },
  },
});
